<?php

namespace App\Http\Controllers;

use App\Services\RaidService;
use Illuminate\Http\Request;

class RaidController extends Controller
{
    protected $service;

    public function __construct(RaidService $raidService)
    {
        $this->service = $raidService;
    }

    public function getUserRaids(Request $request)
    {
        return $this->service->getUserRaids($request);
    }

    public function createRaid(Request $request)
    {
        return $this->service->createRaid($request);
    }

    public function inviteUserToRaid(Request $request, $raidId)
    {
        return $this->service->inviteUserToRaid($request, $raidId);
    }

    public function getRaidDetails($raidId)
    {
        return $this->service->getRaidDetails($raidId);
    }

    public function updateRaidStatus(Request $request, $raidId)
    {
        return $this->service->updateRaidStatus($request, $raidId);
    }

    public function removeUserFromRaid(Request $request, $raidId)
    {
        return $this->service->removeUserFromRaid($request, $raidId);
    }

    public function acceptRaidInvitation(Request $request, $raidId)
    {
        return $this->service->acceptRaidInvitation($request, $raidId);
    }

    public function rejectRaidInvitation(Request $request, $raidId)
    {
        return $this->service->rejectRaidInvitation($request, $raidId);
    }

    public function searchSuitableUsers(Request $request, $raidId)
    {
        return $this->service->searchSuitableUsers($request, $raidId);
    }
}
