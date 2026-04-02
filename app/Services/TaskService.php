<?php

namespace App\Services;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskService
{
    public function createTask(Request $request, $raidId)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'deadline' => 'nullable|date',
            'photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('task_photos', 'public');
        }

        $data['raid_id'] = $raidId;
        $data['created_user_id'] = Auth::id();

        $task = Task::create($data);

        return response()->json($task, 201);
    }

    public function updateTask(Request $request, $taskId)
    {
        $task = Task::findOrFail($taskId);

        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'deadline' => 'nullable|date',
            'photo' => 'nullable|image|max:2048',
            'status' => 'nullable|in:pending,in_progress,completed',
        ]);

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('task_photos', 'public');
        }

        $task->update($data);

        return response()->json($task);
    }

    public function deleteTask($taskId)
    {
        $task = Task::findOrFail($taskId);
        $task->delete();

        return response()->json(null, 204);
    }

    public function getTask($taskId)
    {
        $task = Task::with(['assignedUser', 'creator'])->findOrFail($taskId);

        return response()->json($task);
    }

    public function getOwnTasks()
    {
        $tasks = Task::where('assigned_to', Auth::id())->with(['raid', 'creator'])->get();

        return response()->json($tasks);
    }
}
