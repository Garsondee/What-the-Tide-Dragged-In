# GitHub Repository Setup Guide

Follow these steps to create a GitHub repository for "What the Tide Dragged In"

## Step 1: Create Repository on GitHub

1. Go to https://github.com and log in
2. Click the **"+"** button in the top right, select **"New repository"**
3. Fill in the details:
   - **Repository name:** `what-the-tide-dragged-in` (or your preferred name)
   - **Description:** "A Fate Core adventure set in magical Silverfield, Maine - cats, mysteries, and shapeshifters"
   - **Visibility:** Public (or Private if preferred)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**
5. **Keep this page open** - you'll need the repository URL

## Step 2: Initialize Local Git Repository

Open PowerShell or Command Prompt in the project directory and run:

```powershell
cd "c:\Users\Ingram\Documents\What the Tide Dragged In"
git init
```

## Step 3: Configure Git (if not already done)

Set your name and email (use the same email as your GitHub account):

```powershell
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## Step 4: Add Files to Git

```powershell
git add .
```

This stages all files for commit. To verify what will be committed:

```powershell
git status
```

## Step 5: Create Initial Commit

```powershell
git commit -m "Initial commit: What the Tide Dragged In - Fate Core adventure"
```

## Step 6: Connect to GitHub

Replace `YOUR-USERNAME` and `REPO-NAME` with your actual GitHub username and repository name:

```powershell
git remote add origin https://github.com/YOUR-USERNAME/REPO-NAME.git
```

For example:
```powershell
git remote add origin https://github.com/IngramBlakelock/what-the-tide-dragged-in.git
```

## Step 7: Rename Branch to Main (if needed)

GitHub uses `main` as the default branch name. Rename if your local is `master`:

```powershell
git branch -M main
```

## Step 8: Push to GitHub

```powershell
git push -u origin main
```

You may be prompted to authenticate with GitHub. If using HTTPS:
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your password)

### Creating a Personal Access Token (if needed):

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "What the Tide Dragged In"
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)
7. Use this token as your password when pushing

## Step 9: Verify

Go to your GitHub repository page. You should see all your files!

## Future Updates

After making changes to your adventure:

```powershell
# Check what changed
git status

# Stage all changes
git add .

# Commit with a descriptive message
git commit -m "Add verbose descriptions to Act 2 scenes"

# Push to GitHub
git push
```

## Useful Git Commands

### View commit history
```powershell
git log --oneline
```

### See what changed in files
```powershell
git diff
```

### Undo changes to a file (before commit)
```powershell
git checkout -- filename.md
```

### Create a new branch for experiments
```powershell
git checkout -b experimental-scenes
```

### Switch back to main branch
```powershell
git checkout main
```

## Recommended Repository Settings

Once your repo is created on GitHub:

1. **Add topics** (Repository → About → Settings):
   - `fate-core`
   - `tabletop-rpg`
   - `ttrpg`
   - `adventure`
   - `rpg-adventure`
   
2. **Enable Issues** (for tracking ideas/bugs)

3. **Consider adding a Contributing guide** if you want others to contribute

## Troubleshooting

### "Repository not found" error
- Check the remote URL: `git remote -v`
- Update if wrong: `git remote set-url origin https://github.com/USERNAME/REPO.git`

### Authentication failed
- Make sure you're using a Personal Access Token, not your password
- Check token has correct permissions

### Files not showing on GitHub
- Check git status: `git status`
- Make sure files are committed: `git log`
- Verify pushed: `git push`

---

**Need help?** Check GitHub's documentation: https://docs.github.com/en/get-started
