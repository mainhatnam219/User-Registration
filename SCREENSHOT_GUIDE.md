# JWT Authentication - Screenshot Capture Guide

## Setup (Chuẩn bị)

### 1. Start Backend
```bash
cd backend
npm run start:dev
```
✅ Backend running on `http://localhost:3000`

### 2. Start Frontend
```bash
cd frontend
npm run dev
```
✅ Frontend running on `http://localhost:3001`

### 3. Open DevTools
- Go to `http://localhost:3001`
- Press `F12` to open DevTools
- Go to `Console` tab
- Keep DevTools open while testing

---

## Screenshots to Capture

### Section 1: Access Token Storage (Hình 1c)

**What to show:**
1. Console logs showing token storage
2. localStorage showing refresh_token

**Steps:**
1. Open `http://localhost:3001/login`
2. Open DevTools → Console tab
3. Login with: `user1@example.com` / `password123`
4. Look for console logs:
   ```
   [AUTH] Access token set
   [AUTH] Refresh token stored in localStorage
   ```
5. Go to DevTools → Application → Local Storage
6. Show: `refresh_token` value stored

**Screenshot:**
- Left: Login form
- Right: Console showing [AUTH] logs and localStorage

---

### Section 2a: Axios Instance Configuration (Hình 2a)

**What to show:**
- API_BASE_URL configuration
- Axios instance creation with headers

**How to capture:**
1. Open `src/api/client.ts` in VS Code
2. Show lines 1-15:
   ```typescript
   const API_BASE_URL = ...
   export const apiClient = axios.create({...})
   ```

**Screenshot:**
- VS Code showing Axios setup code

---

### Section 2b: Request Interceptor Code (Hình 2b)

**What to show:**
- Request interceptor attaching Authorization header
- Console logs showing request details

**Steps:**
1. In VS Code, show `src/api/client.ts` lines 17-23
2. In Browser, make a request and capture console:
   ```
   [API] Request: POST /user/login
   ```

**Screenshot:**
- Left: Code showing request interceptor
- Right: Console showing request logs

---

### Section 2c: Response Interceptor Code (Hình 2c)

**What to show:**
- Response interceptor code
- Console showing response handling

**Steps:**
1. In VS Code, show `src/api/client.ts` lines 25-32 (success response)
2. Login and see successful response:
   ```
   [API] Response: 200 /user/login
   ```

**Screenshot:**
- Left: Code showing response interceptor
- Right: Console showing 200 response

---

### Section 2e: Refresh Token Expired (Hình 2e)

**What to show:**
- 401 error handling
- Token refresh logic
- Console showing refresh process

**Steps:**
1. After login, wait for access token to expire (or simulate)
2. Make another API request
3. See console logs:
   ```
   [API] 401 Unauthorized - Attempting token refresh
   [API] ✅ Token refreshed successfully
   ```

**Screenshot:**
- Console showing token refresh process
- Network tab showing refresh request

---

### Section 3a: Login Mutation Code (Hình 3a)

**What to show:**
- `useMutation` hook for login action
- API call with credentials
- Return access_token + refresh_token

**Steps:**
1. Open `frontend/src/pages/Login.tsx`
2. Show this code:
   ```typescript
   const loginMutation = useMutation({
     mutationFn: (credentials) => loginAPI(credentials),
     onSuccess: (data) => {
       setAccessToken(data.access_token);
       setRefreshToken(data.refresh_token);
       navigate('/dashboard');
     }
   });
   ```
3. Or use `useAuth` hook with mutation inside

**Screenshot:**
- VS Code showing `useMutation` hook
- Show mutation state handling

---

### Section 3b: Login Mutation States UI (Hình 3b)

**What to show:**
- `useMutation` states: isLoading, isSuccess, isError
- Button disabled while `isLoading === true`
- Success/error messages from mutation

**Steps:**
1. Open `frontend/src/pages/Login.tsx`
2. Show this code:
   ```typescript
   const { isPending, isError, error } = loginMutation;
   
   <button disabled={isPending} type="submit">
     {isPending ? 'Logging in...' : 'Login'}
   </button>
   
   {isError && <div className="error">{error.message}</div>}
   ```
3. Go to login page in browser
4. During login: Button is disabled, shows "Logging in..."
5. After success: Shows success message or redirects
6. With wrong password: Shows error message

**Screenshots:**
- Screenshot 1: Button disabled with "Logging in..." (loading state)
- Screenshot 2: Success message and redirect (success state)
- Screenshot 3: Error message for invalid credentials (error state)

---

### Section 3c: Logout Mutation Code (Hình 3c)

**What to show:**
- `useMutation` hook for logout action
- `queryClient.invalidateQueries()` clearing cache
- Token cleanup on success

**Steps:**
1. Open `frontend/src/pages/Dashboard.tsx`
2. Show this code:
   ```typescript
   const logoutMutation = useMutation({
     mutationFn: () => logoutAPI(),
     onSuccess: () => {
       queryClient.invalidateQueries();
       clearAccessToken();
       clearRefreshToken();
       localStorage.removeItem('refresh_token');
       navigate('/login');
     }
   });
   
   <button onClick={() => logoutMutation.mutate()}>
     {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
   </button>
   ```
3. In browser: Click logout button
4. See console logs about cache invalidation and redirect

**Screenshot:**
- VS Code showing logout mutation with `invalidateQueries()`
- Browser showing logout button and redirect

---

### Section 3d: useQuery Implementation (Hình 3d)

**What to show:**
- `useQuery` hook fetching user data from protected endpoint
- Query state: `isLoading`, `isError`, `data`
- Console logs showing query execution

**Steps:**
1. Open `frontend/src/pages/Dashboard.tsx` or `src/hooks/useUser.ts`
2. Show this code:
   ```typescript
   const { data: user, isLoading, isError, error } = useQuery({
     queryKey: ['user'],
     queryFn: () => apiClient.get('/user/profile').then(res => res.data),
     enabled: !!accessToken, // Only fetch if user is logged in
   });
   ```
3. After login, navigate to dashboard
4. See console logs:
   ```
   [API] Request: GET /user/profile
   [API] Response: 200 /user/profile
   Query data loaded: {email: "user1@example.com", ...}
   ```
5. Show loading state while fetching, then user data

**Screenshot:**
- VS Code showing `useQuery` with queryKey and queryFn
- Dashboard showing user data (email, profile info)
- Console showing query execution logs

---

### Section 3e: React Query DevTools (Hình 3e)

**What to show:**
- React Query DevTools panel showing all queries/mutations
- Query cache: `['user']` query with its data
- Mutation cache: `login` and `logout` mutations
- Query state visualization

**How to capture:**
1. Start frontend: `npm run dev`
2. Login to dashboard
3. Look at bottom-right corner - you should see a small floating icon
4. Click icon to open React Query DevTools panel
5. See tabs for "Queries" and "Mutations"
6. Under Queries tab:
   - `['user']` query showing status (fresh/stale)
   - Data payload: `{email: "user1@example.com", ...}`
7. Under Mutations tab:
   - `login` mutation
   - `logout` mutation
   - Show their states and data

**Alternative if floating icon not visible:**
1. Check browser console for any errors
2. Verify DevTools is imported in `App.tsx`:
   ```typescript
   import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
   ```
3. Make sure it's added inside QueryClientProvider:
   ```tsx
   <ReactQueryDevtools initialIsOpen={false} />
   ```

**Screenshot:**
- DevTools panel open showing Queries and Mutations tabs
- Display cached data for `['user']` query
- Show mutation states

---

### Section 3f: Query Invalidation (Hình 3f)

**What to show:**
- `queryClient.invalidateQueries()` clearing cache on logout
- Console logs showing invalidation
- Query state changing from "stale" to "needs refetch"

**Steps:**
1. Open `frontend/src/pages/Dashboard.tsx` (logout handler)
2. Show this code:
   ```typescript
   const logoutMutation = useMutation({
     mutationFn: () => logoutAPI(),
     onSuccess: () => {
       // This invalidates all queries
       queryClient.invalidateQueries();
       
       // Or specifically invalidate user query:
       // queryClient.invalidateQueries({ queryKey: ['user'] });
       
       clearTokens();
       navigate('/login');
     }
   });
   ```
3. In browser:
   - After login, user data is cached in React Query
   - Open React Query DevTools
   - Note `['user']` query status is "fresh"
   - Click logout button
   - Watch DevTools: query status changes to "invalid"
   - Cache is cleared
4. See console logs:
   ```
   [AUTH] ✅ Logged out - Tokens cleared
   [RQ] Queries invalidated
   ```

**Screenshot:**
- React Query DevTools showing:
  - Before logout: `['user']` query with "fresh" status and cached data
  - After logout: Query marked as "invalid" or cleared
- Console showing invalidation logs

---

### Section 4a: Form Implementation Code (Hình 4a)

**What to show:**
- React Hook Form setup
- useForm hook

**Screenshot:**
- VS Code showing `useForm<LoginFormInputs>({...})`

---

### Section 4b: Validation Schema Code (Hình 4b)

**What to show:**
- Validation rules (required, pattern, minLength)
- register() function

**Screenshot:**
- VS Code showing register() with validation rules

---

### Section 4c: Validation Errors UI (Hình 4c)

**What to show:**
- Error messages displayed on form
- Red border on invalid fields

**Steps:**
1. Go to login page
2. Leave fields empty and try submit
3. See validation errors:
   - "Email is required"
   - "Password is required"
4. Enter invalid email
5. See "Please enter a valid email"

**Screenshots:**
- Screenshot 1: All fields empty → errors
- Screenshot 2: Invalid email → error
- Screenshot 3: Short password → error

---

### Section 4d: Form Submission Code (Hình 4d)

**What to show:**
- handleSubmit wrapper
- onSubmit handler

**Screenshot:**
- VS Code showing `handleSubmit(onSubmit)`

---

### Section 4e: Loading State UI (Hình 4e)

**What to show:**
- Button disabled while submitting
- Loading indicator
- Console logs

**Steps:**
1. On login form
2. Click submit button
3. Capture while loading (button should be disabled/grayed)

**Screenshot:**
- Login button disabled/grayed with "Loading..." text
- Console showing [LOGIN] logs

---

## Console Logs Reference

### During Login
```
[LOGIN] Form submitted: user1@example.com
[LOGIN] Form validation passed, sending API request...
[LOGIN] Credentials: {email: "user1@example.com"}
[API] Request: POST /user/login
[AUTH] Access token set
[AUTH] Refresh token stored in localStorage
[LOGIN] ✅ Login successful
[API] Response: 200 /user/login
```

### During Logout
```
[AUTH] ✅ Logged out - Tokens cleared
Redirected to /login
```

### During Token Refresh (401 Error)
```
[API] 401 Unauthorized - Attempting token refresh
[API] Request: POST /user/refresh
[API] ✅ Token refreshed successfully
[API] Response: 200 /user/refresh
[API] Request: (original request) POST /api/user/profile
```

---

## Tips for Better Screenshots

1. **Clear Console:** Clear console before each test (Ctrl+L or click clear icon)
2. **Zoom DevTools:** Make text bigger for better readability (Ctrl/Cmd + Plus)
3. **Arrange Splits:** 
   - Left: Application/Form
   - Right: DevTools Console
4. **Capture Full Context:**
   - Show URL bar
   - Show form/UI
   - Show console logs
   - Show localStorage/network if relevant
5. **Timing:** Capture at key moments (loading, success, error)

---

## Video/GIF Alternative

Instead of static screenshots, you can also:
1. Open DevTools (F12)
2. Use Screen Recording tool in DevTools
3. Record: Login flow → Logout flow → Error handling
4. Shows everything in motion with timestamps

---

## Checklist Before Presenting

- ✅ Backend running (port 3000)
- ✅ Frontend running (port 3001)
- ✅ DevTools open and visible
- ✅ Console logs showing clearly
- ✅ localStorage showing refresh_token
- ✅ Screenshots captured with context
- ✅ All 8 sections covered with evidence
- ✅ Console logs matching expected output
