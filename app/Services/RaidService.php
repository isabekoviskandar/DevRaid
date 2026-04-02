<?php

namespace App\Services;

use App\Models\Raid;
use App\Models\RaidUser;
use App\Models\User;
use Illuminate\Http\Request;

class RaidService
{
    /**
     * Get raids created by the user + raids the user is a member of.
     */
    public function getUserRaids(Request $request)
    {
        $data = $request->validate([
            'status' => 'nullable|string',
        ]);

        $id = $request->user()->id;

        // Created raids
        $createdRaids = Raid::where('created_user_id', $id)
            ->with('creator', 'users')
            ->when(isset($data['status']), fn ($q) => $q->where('status', $data['status']))
            ->get()
            ->map(fn ($raid) => $raid->setAttribute('relation_type', 'created'));

        // Joined raids (via pivot)
        // Joined raids (via pivot)
        $joinedRaids = Raid::whereHas('users', fn ($q) => $q->where('user_id', $id))
            ->with('creator', 'users')
            ->when(isset($data['status']), fn ($q) => $q->where('status', $data['status']))
            ->get()
            ->map(function ($raid) use ($id) {
                /** @var RaidUser|null $pivotRecord */
                $pivotRecord = RaidUser::where('raid_id', $raid->id)
                    ->where('user_id', $id)
                    ->first();

                $raid->setAttribute('relation_type', 'member');
                $raid->setAttribute('member_status', $pivotRecord?->status);
                $raid->setAttribute('member_role', $pivotRecord?->role);

                return $raid;
            });

        return response()->json([
            'created' => $createdRaids,
            'joined' => $joinedRaids,
        ]);
    }

    public function createRaid(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'created_user_id' => 'required|integer|exists:users,id',
            'status' => 'required|string',
            'required_soft_skills' => 'nullable|string',
            'required_hard_skills' => 'nullable|string',
            'required_personality_type' => 'nullable|string',
        ]);

        $raid = Raid::create($data);

        return response()->json($raid, 201);
    }

    /**
     * Search users by skills/personality — no raidId needed.
     */
    public function searchSuitableUsers(Request $request)
    {
        $data = $request->validate([
            'soft_skills' => 'nullable|string',
            'hard_skills' => 'nullable|string',
            'personality_type' => 'nullable|string',
        ]);

        $users = User::query()
            ->when(
                $data['soft_skills'] ?? null,
                fn ($q, $v) => $q->where('soft_skills', 'like', "%$v%")
            )
            ->when(
                $data['hard_skills'] ?? null,
                fn ($q, $v) => $q->where('hard_skills', 'like', "%$v%")
            )
            ->when(
                $data['personality_type'] ?? null,
                fn ($q, $v) => $q->where('personality_type', 'like', "%$v%")
            )
            ->get();

        return response()->json($users);
    }

    /**
     * Invite a user — stored as pending with a role.
     */
    public function inviteUserToRaid(Request $request, $raidId)
    {
        $data = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'role' => 'nullable|string',
        ]);

        $raid = Raid::findOrFail($raidId);

        // Avoid duplicate invitations
        if ($raid->users()->where('user_id', $data['user_id'])->exists()) {
            return response()->json(['message' => 'User already invited or in raid.'], 409);
        }

        $raid->users()->attach($data['user_id'], [
            'role' => $data['role'] ?? 'member',
            'status' => 'pending',
        ]);

        return response()->json(['message' => 'User invited to raid successfully.']);
    }

    public function getRaidDetails($raidId)
    {
        $raid = Raid::with('creator', 'users')->findOrFail($raidId);

        return response()->json($raid);
    }

    public function updateRaidStatus(Request $request, $raidId)
    {
        $data = $request->validate([
            'status' => 'required|string',
        ]);

        $raid = Raid::findOrFail($raidId);
        $raid->update(['status' => $data['status']]);

        return response()->json(['message' => 'Raid status updated successfully.']);
    }

    public function removeUserFromRaid(Request $request, $raidId)
    {
        $data = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $raid = Raid::findOrFail($raidId);
        $raid->users()->detach($data['user_id']);

        return response()->json(['message' => 'User removed from raid successfully.']);
    }

    /**
     * Accept: flip pivot status to 'accepted'.
     */
    public function acceptRaidInvitation(Request $request, $raidId)
    {
        $user = $request->user();
        $raid = Raid::findOrFail($raidId);

        $exists = $raid->users()->where('user_id', $user->id)->exists();

        if (! $exists) {
            return response()->json(['message' => 'No invitation found.'], 404);
        }

        $raid->users()->updateExistingPivot($user->id, ['status' => 'accepted']);

        return response()->json(['message' => 'Raid invitation accepted successfully.']);
    }

    /**
     * Reject: flip pivot status to 'rejected' (keep record for audit).
     */
    public function rejectRaidInvitation(Request $request, $raidId)
    {
        $user = $request->user();
        $raid = Raid::findOrFail($raidId);

        $exists = $raid->users()->where('user_id', $user->id)->exists();

        if (! $exists) {
            return response()->json(['message' => 'No invitation found.'], 404);
        }

        $raid->users()->updateExistingPivot($user->id, ['status' => 'rejected']);

        return response()->json(['message' => 'Raid invitation rejected successfully.']);
    }
}
