# Render.com Deployment Setup

## Environment Variables

Set these environment variables in your Render dashboard:

### Required Variables:
- `MONGODB_URI` - Your MongoDB connection string
- `NODE_ENV` - Set to `production`
- `PORT` - Render will set this automatically, but you can override if needed

### Optional Variables:
- `RENDER_URL` - Your Render app URL (e.g., `https://your-app-name.onrender.com`)

## Steps to Fix Swagger NetworkError:

1. **Update your Render URL in swagger.js:**
   - Replace `'https://your-app-name.onrender.com'` with your actual Render URL
   - Or set the `RENDER_URL` environment variable in Render

2. **Deploy the updated code:**
   ```bash
   git add .
   git commit -m "Fix Swagger configuration for production"
   git push origin main
   ```

3. **Test the endpoints:**
   - Visit: `https://your-app-name.onrender.com/api-docs`
   - Test JSON endpoint: `https://your-app-name.onrender.com/api-docs.json`

## Troubleshooting:

### If you still get NetworkError:
1. Check that your Render URL is correct in the environment variables
2. Ensure the `/api-docs.json` endpoint is accessible
3. Check Render logs for any errors

### Common Issues:
- **CORS errors**: The new configuration should handle this
- **Wrong base URL**: Make sure `RENDER_URL` environment variable is set correctly
- **Missing dependencies**: Ensure all packages are in `package.json`

## Testing Locally:
```bash
# Test with production-like environment
NODE_ENV=production npm start

# Test Swagger JSON endpoint
curl http://localhost:3000/api-docs.json
```
