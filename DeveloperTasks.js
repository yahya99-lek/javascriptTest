function assignTasksWithPriorityAndDependencies(developers, tasks) {
  tasks.sort((a, b) => b.priority - a.priority || b.difficulty - a.difficulty);

  const developerAssignments = developers.map((dev) => ({
    name: dev.name,
    assignedTasks: [],
    totalHours: 0,
  }));

  const completedTasks = new Set();
  const unassignedTasks = [];

  for (const task of tasks) {
    const { difficulty, hoursRequired, taskType, dependencies } = task;

    const dependenciesMet = dependencies.every((dep) =>
      completedTasks.has(dep)
    );
    if (!dependenciesMet) {
      unassignedTasks.push(task);
      continue;
    }

    const suitableDeveloper = developerAssignments.find((dev) => {
      const developer = developers.find((d) => d.name === dev.name);
      return (
        dev.totalHours + hoursRequired <= developer.maxHours &&
        developer.skillLevel >= difficulty &&
        (developer.preferredTaskType === taskType ||
          dev.assignedTasks.length === 0)
      );
    });

    if (suitableDeveloper) {
      suitableDeveloper.assignedTasks.push(task);
      suitableDeveloper.totalHours += hoursRequired;
      completedTasks.add(task.taskName);
    } else {
      unassignedTasks.push(task);
    }
  }
  return { developerAssignments, unassignedTasks };
}
