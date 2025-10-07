# UMILAX Frontend - Quick Start Guide

Get up and running with the UMILAX Salon Management System in minutes!

## 🚀 Quick Setup (5 minutes)

### Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/lawalTheWest/umilax_frontend_v0.1.git
cd umilax_frontend_v0.1

# Install dependencies
npm install
```

### Step 2: Start Development Server

```bash
npm start
```

### Step 3: Run on Device

**Option A: Physical Device**
- Install "Expo Go" app from App Store (iOS) or Play Store (Android)
- Scan the QR code displayed in terminal

**Option B: Emulator/Simulator**
- Press `a` for Android emulator
- Press `i` for iOS simulator

**Option C: Web Browser**
- Press `w` to open in web browser

## 📱 First Login

### Test Credentials

The app connects to the backend at `https://umilax.onrender.com`

**CEO Login:**
- Username: `ceo`
- Password: (ask admin)

**Secretary Login:**
- Username: `secretary`
- Password: (ask admin)

**Employee Login:**
- Username: `employee`
- Password: (ask admin)

### Login Flow

1. Open app → Splash screen appears
2. Swipe left or tap "Next" to go to login
3. Enter username and password
4. Tap "Login"
5. Redirected to role-specific dashboard

## 🎯 Quick Feature Tour

### As CEO

1. **View Dashboard**
   - See total earnings, expenses, transaction counts
   - View bar charts of financial data
   - Check recent transactions

2. **Manage Shops**
   - Tap "Shops" card
   - Tap "+" to add new shop
   - Enter: Name, Location, Division Base

3. **Approve Expenses**
   - Tap "Expenses" card
   - Review pending expenses
   - Tap "Approve" or "Reject"

4. **Generate Reports**
   - Tap "Reports" card
   - Select date range
   - Choose report type (Daily/Weekly/Monthly/Yearly)
   - Tap "Export PDF" or "Export CSV"

### As Secretary

1. **Record Service**
   - From dashboard, tap "Record Service"
   - Select service(s) from list
   - Choose employee who rendered service
   - Select payment type
   - (Optional) Enter manual price
   - Tap "Record Transaction"

2. **Log Expense**
   - Tap "Log Expense"
   - Enter description (e.g., "Dye purchase")
   - Enter amount
   - (Optional) Upload receipt photo
   - Tap "Add Expense"

3. **View Transactions**
   - Tap "Transactions"
   - Search or filter by date
   - View transaction details

### As Employee

1. **View Dashboard**
   - See personal details and performance
   - Check guarantor information

2. **Track Earnings**
   - Tap "Earnings"
   - View total earnings
   - See breakdown by service

3. **Submit Complaint**
   - Tap "Complaints"
   - Enter complaint message
   - Tap "Submit"

## 🔧 Development Workflow

### Making Changes

1. **Edit code** in your favorite editor (VS Code recommended)
2. **Save file** → App hot-reloads automatically
3. **Check terminal** for any errors
4. **Test changes** on device/simulator

### Common Commands

```bash
# Start dev server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Build for Android
npm run android

# Build for iOS
npm run ios

# Clear cache
npm start -- --clear
```

### Project Structure

```
umilax_frontend_v0.1/
├── app/           # Expo Router screens
├── screens/       # Screen components
├── components/    # Reusable components
├── utils/         # Helper functions
│   ├── api.ts            # API base URL
│   ├── authStorage.ts    # Token management
│   └── offlineQueue.ts   # Offline sync
├── constants/     # App constants
└── assets/        # Images, fonts
```

## 🐛 Troubleshooting

### App Won't Start

```bash
# Clear cache and restart
npm start -- --clear

# Or reset everything
rm -rf node_modules
npm install
npm start
```

### Can't Connect to Backend

1. Check internet connection
2. Verify backend URL in `utils/api.ts`:
   ```typescript
   export const BASE_API_URL = 'https://umilax.onrender.com';
   ```
3. Test backend in browser: https://umilax.onrender.com

### Login Not Working

1. Verify credentials with admin
2. Check console for error messages
3. Ensure backend is running
4. Clear app data and retry

### Offline Mode Issues

1. Check network status indicator
2. View queued items: `await getQueue()`
3. Manually sync: `await syncQueue(token)`
4. Clear queue if needed: `await AsyncStorage.removeItem('@umilax_offline_queue_v1')`

## 📚 Documentation

### Read Next

1. **[README.md](README.md)** - Complete documentation
2. **[FEATURES.md](FEATURES.md)** - All features explained
3. **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** - Development guide
4. **[FRONTEND_API_GUIDE.md](FRONTEND_API_GUIDE.md)** - API integration
5. **[dev_dir/api-spec.md](dev_dir/api-spec.md)** - Backend API spec
6. **[EAS_BUILD_INSTRUCTIONS.md](EAS_BUILD_INSTRUCTIONS.md)** - Build for production

## 🎓 Learning Resources

### React Native
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Testing
- [Jest Docs](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)

## 💡 Pro Tips

### Productivity Hacks

1. **Use Hot Reload**: Changes appear instantly without full reload
2. **Debug Menu**: Shake device (physical) or press `Cmd+D` (iOS) / `Cmd+M` (Android)
3. **Element Inspector**: Enable in debug menu to inspect UI elements
4. **Network Inspector**: Use React Native Debugger to see API calls
5. **Console Logging**: Use `console.log()`, `console.table()`, `console.time()`

### Code Quality

1. **Run linter before commit**: `npm run lint`
2. **Run tests frequently**: `npm test`
3. **Use TypeScript types**: Define interfaces for data structures
4. **Follow naming conventions**: PascalCase for components, camelCase for functions

### Performance

1. **Memoize expensive components**: Use `React.memo()`
2. **Optimize lists**: Use `FlatList` with `keyExtractor` and `getItemLayout`
3. **Lazy load images**: Use `expo-image` with caching
4. **Minimize re-renders**: Use `useCallback` and `useMemo`

## 🚢 Deploying to Production

### Quick Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for Android
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production
```

See [EAS_BUILD_INSTRUCTIONS.md](EAS_BUILD_INSTRUCTIONS.md) for detailed instructions.

## 🆘 Getting Help

### Support Channels

1. **Check Documentation**: Start with README.md
2. **Search Issues**: GitHub repository issues
3. **Ask Team**: Create detailed issue with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots
   - Error messages

### Debug Checklist

- [ ] Checked internet connection
- [ ] Verified backend is running
- [ ] Reviewed error messages in console
- [ ] Tested with cleared cache
- [ ] Checked authentication token
- [ ] Reviewed API request/response
- [ ] Tested on different device/simulator

## ✅ Next Steps

After setup, you should:

1. ✅ Explore the app features as different roles
2. ✅ Review the codebase structure
3. ✅ Read the [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)
4. ✅ Understand the API integration in [FRONTEND_API_GUIDE.md](FRONTEND_API_GUIDE.md)
5. ✅ Learn about features in [FEATURES.md](FEATURES.md)
6. ✅ Write your first feature or fix a bug
7. ✅ Submit a pull request

## 🎉 You're Ready!

You now have a working UMILAX frontend development environment. Start building amazing features!

**Happy Coding! 🚀**

---

**Questions?** Check the [README.md](README.md) or open an issue on GitHub.
