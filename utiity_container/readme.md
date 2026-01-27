why we use always new container for each task:
1. Utility Containers Are Ephemeral

Utility containers are meant for one-off tasks, like:
Running database migrations
Running a batch script
Performing a backup
Inspecting or debugging a container

Since these tasks are usually short-lived, you don’t need to preserve the container’s state after the task completes. Docker encourages creating a fresh container each time so you start from a known clean state.

2. Isolation and Consistency

If you reused an old container:
It might have leftover state (files, processes, environment variables) from the previous run.
That leftover state could cause unpredictable behavior.

Starting fresh ensures that your utility container behaves the same way every time, which is critical in CI/CD pipelines or automated scripts.

3. Docker Philosophy: Immutability

Containers are designed to be immutable:
The image is read-only.
Containers are ephemeral “instances” of that image.

Once a container does its job and exits, it’s generally expected to be discarded.
This makes it easier to reason about your deployments, automation, and debugging.

✅ Summary

You create a new utility container each time because:
You want a clean, predictable environment.
Containers are designed to be short-lived for tasks, not long-running services.
Reusing containers can introduce state conflicts and inconsistencies.