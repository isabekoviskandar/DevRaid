<?php

namespace App\Http\Controllers;

use App\Services\TaskService;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    protected $service;

    public function __construct(TaskService $taskService)
    {
        $this->service = $taskService;
    }

    public function store(Request $request, $raidId)
    {
        return $this->service->createTask($request, $raidId);
    }

    public function update(Request $request, $taskId)
    {
        return $this->service->updateTask($request, $taskId);
    }

    public function destroy($taskId)
    {
        return $this->service->deleteTask($taskId);
    }

    public function getTask($raidId)
    {
        return $this->service->getTask($raidId);
    }

    public function getOwnTasks()
    {
        return $this->service->getOwnTasks();
    }
}
