---
name: testing-bookshop-auth
description: How to run the BookShop stack locally (API + Next.js frontend + SQL Server) and test login/registration flows end-to-end through the browser UI.
---

# Testing BookShop auth (login / registration) locally

## Bring up the stack
1. SQL Server (dev only):
   `docker run -d --name mssql -p 1433:1433 -e ACCEPT_EULA=Y -e MSSQL_SA_PASSWORD='Str0ng!Passw0rd' mcr.microsoft.com/mssql/server:2022-latest`
2. API (`.NET SDK` at `$HOME/.dotnet`, add to PATH), ~40-60s to start, applies migrations + seeds admin:
   ```
   cd BookShopAPI && ASPNETCORE_ENVIRONMENT=Development ASPNETCORE_URLS=http://localhost:5130 \
     ConnectionStrings__DefaultConnection="Server=localhost,1433;Database=BookShopMaster;User ID=sa;Password=Str0ng!Passw0rd;TrustServerCertificate=true" \
     setsid nohup dotnet run > /tmp/api.log 2>&1 < /dev/null &
   ```
   Use `setsid nohup ... < /dev/null &` — a plain `&` background job can be killed when the shell call times out.
3. Frontend needs `frondbookshop/.env.local` (it is gitignored, create it):
   ```
   API_HOST=http://localhost:5130
   NEXT_PUBLIC_API_URL=http://localhost:5130
   NEXT_PUBLIC_API_HOST=http://localhost:5130
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=dev-secret-change-me
   ```
   Then `cd frondbookshop && npm install && npm run dev` (port 3000).
4. If multiple clones/worktrees exist, confirm the running servers belong to the branch under test:
   `ls -l /proc/$(ss -lntp | grep :3000 | grep -o 'pid=[0-9]*' | cut -d= -f2)/cwd`

## UI paths
- Sign in: `http://localhost:3000/auth/signin` (email + password + "User"/"Translator" toggle). Errors render as red text above the Sign In button, e.g. "Invalid credentials".
- Sign up: `http://localhost:3000/auth/signup` (Name, Email, Account type, Password, Confirm) -> on success redirects to `/auth/signin`; server errors render in red under the Email field.
- Role check without devtools: after login the header shows an **Admin** link only for role `Admin` (`components/shared/profile-button`), and a **Translator** link for Author/Admin.
- Typing a bare `localhost:3000/...` into the Chrome omnibox may trigger a Google search; always type the full `http://localhost:3000/...`.

## Useful DB checks (dev container `mssql`)
```
docker exec mssql /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'Str0ng!Passw0rd' -C -h -1 -W \
  -Q "SET NOCOUNT ON; SELECT Id,Email,Username,Role,IsActive FROM BookShopMaster.dbo.Users"
```
Usernames are derived from the email local part, so `x@a.com` and `x@b.ru` collide; the frontend `/api/users` route retries with a `_NNNNN` suffix.

## Admin recovery path
The seeder is config-driven: `AdminUser__Email`, `AdminUser__Username`, `AdminUser__Password`, `AdminUser__ResetPassword`.
To simulate a broken admin: stop the API, `UPDATE ...Users SET PasswordHash='x' WHERE Email='admin@bookshop.com'` (login then fails; the API returns 500 from BCrypt, the UI shows "Invalid credentials"), then restart with `AdminUser__ResetPassword=true` and look for `Admin password reset for ...` in the API log. Remember to restart the API WITHOUT the flag afterwards.

## Devin Secrets Needed
None — all credentials are local dev defaults (`sa` / `Str0ng!Passw0rd`, admin@bookshop.com / Admin123!).
