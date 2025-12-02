# GitHub Setup Instructions

## After creating your GitHub repository, run these commands:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/cookify.git

# Push your code to GitHub
git push -u origin main
```

## Alternative: If you prefer SSH

```bash
# Add SSH remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin git@github.com:YOUR_USERNAME/cookify.git

# Push your code to GitHub
git push -u origin main
```

## If you need to authenticate:

- For HTTPS: GitHub will prompt for your username and a Personal Access Token (not password)
- For SSH: Make sure you have SSH keys set up in your GitHub account

## To create a Personal Access Token:

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Select scopes: `repo` (full control of private repositories)
4. Copy the token and use it as your password when pushing

