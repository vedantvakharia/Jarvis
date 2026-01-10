## 1. Setup & Configuration

Configure user information and preferences for all local repositories or specific ones.

|**Command**|**Description**|
|---|---|
|`git config --global user.name "Name"`|Set the name attached to your commits globally.|
|`git config --global user.email "email"`|Set the email attached to your commits globally.|
|`git config --global color.ui auto`|Enable helpful colorization of command line output.|
|`git config --global core.editor "code --wait"`|Set default editor (e.g., VS Code).|
|`git config --list`|List all configuration settings.|
|`git config --show-origin --list`|List settings and show which file defines them.|
|`git config --global alias.<name> <command>`|Create a shortcut (e.g., `git config --global alias.co checkout`).|
|`git help <verb>`|Open the manual page for a specific command.|

---

## 2. Getting & Creating Projects

Initialize a new repository or get one from a URL.

- **Initialize:**
    
    - `git init` — Create a new local repository in the current directory.
        
    - `git init <project-name>` — Create a new directory and initialize it.
        
- **Clone:**
    
    - `git clone <url>` — Download a project and its entire version history.
        
    - `git clone --depth=1 <url>` — Shallow clone (only the latest snapshot, saves bandwidth).
        
    - `git clone -b <branch> <url>` — Clone a specific branch only.
        

---

## 3. Basic Snapshotting (The Workflow)

Work with files and save changes to the history.

### Staging

- `git status` — Show modified files in working directory, staged for your next commit.
    
- `git add [file]` — Add a file as it looks now to your next commit (stage it).
    
- `git add .` — Stage all changes in the current directory.
    
- `git add -p` — Interactive staging (stage parts/hunks of a file).
    

### Committing

- `git commit -m "Message"` — Commit your staged content as a new snapshot.
    
- `git commit -am "Message"` — Stage **tracked** files and commit in one step.
    
- `git commit --amend` — Replace the last commit with the staged changes and/or a new message (don't do this if pushed!).
    
- `git commit --amend --no-edit` — Add staged changes to the previous commit without changing the message.
    

### Removal & Moving

- `git rm [file]` — Delete the file from the project and stage the removal.
    
- `git rm --cached [file]` — Remove the file from version control but keep it locally.
    
- `git mv [existing-path] [new-path]` — Rename or move a file and stage the change.
    

---

## 4. Branching & Merging

Manage parallel lines of development.

### Branch Management

- `git branch` — List your branches. a `*` will appear next to the currently active branch.
    
- `git branch -a` — List all local and remote branches.
    
- `git branch [branch-name]` — Create a new branch at the current commit.
    
- `git branch -d [branch-name]` — Delete a branch (prevents deletion if unmerged).
    
- `git branch -D [branch-name]` — Force delete a branch.
    
- `git branch -m [old] [new]` — Rename a branch.
    

### Switching (Checkout/Switch)

- `git checkout [branch-name]` — Switch to another branch.
    
- `git checkout -b [branch-name]` — Create a new branch and switch to it immediately.
    
- `git switch [branch-name]` — (Modern) Switch to a branch.
    
- `git switch -c [branch-name]` — (Modern) Create and switch.
    

### Merging

- `git merge [branch]` — Merge the specified branch’s history into the current one.
    
- `git merge --abort` — Abort a merge in case of conflicts.
    
- `git merge --squash [branch]` — Merge all commits from target branch into a single commit.
    

---

## 5. Sharing & Updating (Remotes)

Sync with remote repositories (GitHub, GitLab, Bitbucket).

- `git remote add [alias] [url]` — Add a git URL as an alias (usually `origin`).
    
- `git remote -v` — Show the URLs of the remotes.
    
- `git remote show [alias]` — Show more details about a specific remote.
    
- `git remote rename [old] [new]` — Rename a remote alias.
    
- `git remote remove [alias]` — Delete a remote alias.
    

### Fetching & Pulling

- `git fetch [alias]` — Fetch down all the branches from that Git remote (does not merge).
    
- `git pull` — Fetch and merge the remote branch into your current branch.
    
- `git pull --rebase` — Fetch and rebase local commits on top of upstream changes (cleaner history).
    

### Pushing

- `git push [alias] [branch]` — Transmit local branch commits to the remote repository.
    
- `git push -u [alias] [branch]` — Push and set upstream tracking information.
    
- `git push --force` — Overwrite remote history (dangerous).
    
- `git push --force-with-lease` — Safer force push (checks if remote was updated by someone else).
    
- `git push --all` — Push all branches.
    
- `git push --tags` — Push all tags.
    

---

## 6. Inspection & Comparison

Examine logs, diffs, and object information.

### Logs

- `git log` — Show the commit history for the currently active branch.
    
- `git log --oneline` — Show commit history in a single line format.
    
- `git log --graph --oneline --decorate --all` — Visualization of the history graph.
    
- `git log -p [file]` — Show changes over time for a specific file.
    
- `git log --author="name"` — Search logs by author.
    
- `git log --grep="pattern"` — Search logs by commit message.
    
- `git log --stat` — Show stats (files changed, insertions/deletions) for each commit.
    
- `git shortlog -sn` — Show a summary of who contributed how many commits.
    

### Diffs

- `git diff` — Show changes between working directory and staging area.
    
- `git diff --staged` — Show changes between staging area and last commit.
    
- `git diff [source-branch] [target-branch]` — Show difference between two branches.
    
- `git diff [commit-id] [commit-id]` — Show difference between two specific commits.
    

### Attribution

- `git blame [file]` — Show who changed what and when in a file (line by line).
    

---

## 7. Undo & Reset

Rewriting history and correcting mistakes.

- `git restore [file]` — Discard changes in working directory (modern equivalent of `checkout`).
    
- `git restore --staged [file]` — Unstage a file (modern equivalent of `reset HEAD`).
    
- `git clean -fd` — Remove untracked files and directories from the working tree.
    

### Reset (Moving HEAD)

- `git reset [commit]` — Undo all commits after `[commit]`, preserving changes locally.
    
- `git reset --hard [commit]` — Discard all history and changes back to the specified commit.
    
- `git reset --soft [commit]` — Undo commits but keep changes staged.
    

### Revert

- `git revert [commit]` — Create a new commit that undoes the changes of a previous commit (safe for public history).
    

---

## 8. Temporary Storage (Stashing)

Temporarily shelve changes without committing.

- `git stash` — Save modified and staged changes to a stack.
    
- `git stash list` — List stack-order of stashed file changes.
    
- `git stash pop` — Write working from top of stack and remove it from stack.
    
- `git stash apply` — Write working from top of stack but keep it in stack.
    
- `git stash drop` — Discard the changes from top of stack.
    
- `git stash clear` — Delete all stashes.
    
- `git stash branch [branch-name]` — Create a new branch from a stash.
    

---

## 9. Advanced Concepts

Powerful tools for complex history management.

### Rebasing

- `git rebase [branch]` — Apply commits from current branch ahead of specified branch.
    
- `git rebase -i [commit]` — Interactive rebase (squash, edit, reorder, or drop commits).
    
- `git rebase --abort` — Stop the rebase.
    
- `git rebase --continue` — Continue rebase after resolving conflicts.
    

### Tagging

- `git tag` — List tags.
    
- `git tag [name]` — Create a lightweight tag at current commit.
    
- `git tag -a [name] -m "msg"` — Create an annotated tag (recommended for releases).
    
- `git tag -d [name]` — Delete a local tag.
    

### Cherry-Picking

- `git cherry-pick [commit]` — Apply the changes introduced by some existing commit to the current branch.
    

### Bisect (Debugging)

- `git bisect start` — Start binary search to find the commit that introduced a bug.
    
- `git bisect bad` — Mark current commit as broken.
    
- `git bisect good [commit]` — Mark a known historical commit as working.
    
- (Git will now check out a middle commit for you to test)
    
- `git bisect reset` — Quit bisect mode.
    

---

## 10. Submodules & Worktrees

Managing complex repository structures.

- `git submodule add [url]` — Add a repository as a submodule.
    
- `git submodule update --init --recursive` — Initialize and update submodules.
    
- `git worktree add [path] [branch]` — Check out a branch into a separate directory (run two branches simultaneously).
    
- `git worktree list` — List active worktrees.
    
- `git worktree remove [path]` — Remove a worktree.
    

---

## 11. Plumbing (Low Level)

Commands usually used by scripts, but occasionally useful for manual recovery.

- `git reflog` — A log of where your HEAD and branch references have been (crucial for recovering lost commits).
    
- `git fsck` — Verifies the connectivity and validity of the objects in the database.
    
- `git gc` — Garbage collector; cleans up unnecessary files and optimizes the local repository.
    
- `git cat-file -p [object]` — Print the content of a git object (blob, tree, commit).
    
- `git ls-tree [commit]` — List the contents of a tree object (like `ls` for a commit).
    
- `git rev-parse --show-toplevel` — specific path of the root directory of the repo.
    
- `git update-index --assume-unchanged [file]` — Tell git to stop tracking changes to a file (useful for local config files).
    

---

### Would you like me to explain any specific command (like `rebase -i` or `reflog`) in more detail with examples?