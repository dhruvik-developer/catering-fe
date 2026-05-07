import { createContext, useState } from "react";
import tokenService from "../services/tokenService";
import { normalizeAccessList } from "../utils/accessControl";

// Create UserContext
const UserContext = createContext();

// UserProvider Component
// eslint-disable-next-line react/prop-types
const UserProvider = ({ children }) => {
  const [token, setToken] = useState(() => tokenService.getToken());
  const [username, setUsername] = useState(() => tokenService.getUsername());
  const [userType, setUserType] = useState(() => tokenService.getUserType());
  const [permissions, setPermissions] = useState(() =>
    tokenService.getPermissions()
  );
  const [enabledModules, setEnabledModules] = useState(() =>
    tokenService.getEnabledModules()
  );
  const [tenant, setTenant] = useState(() => tokenService.getTenant());
  const [branchProfile, setBranchProfileState] = useState(() =>
    tokenService.getBranchProfile()
  );
  // Three-tier branch role flags returned by /api/login/. Drives Branches
  // sidebar visibility, the user-create role dropdown, the global branch
  // filter, and any other UI gate where "main admin" vs "branch admin" vs
  // "branch user" matters.
  const [branchRoleFlags, setBranchRoleFlagsState] = useState(() =>
    tokenService.getBranchRoleFlags()
  );

  // Function to log in and store the token
  const login = (
    accessToken,
    username,
    nextUserType,
    userPermissions = [],
    nextEnabledModules = [],
    nextTenant = null,
    nextBranchProfile = null,
    nextBranchRoleFlags = null
  ) => {
    const normalizedPermissions = normalizeAccessList(userPermissions);
    const normalizedEnabledModules = normalizeAccessList(nextEnabledModules);
    const normalizedRoleFlags = nextBranchRoleFlags || {
      branch_role: null,
      is_main_tenant_admin: false,
      is_branch_admin: false,
    };

    tokenService.setToken(accessToken);
    tokenService.setUsername(username);
    tokenService.setUserType(nextUserType);
    tokenService.setPermissions(normalizedPermissions);
    tokenService.setEnabledModules(normalizedEnabledModules);
    tokenService.setTenant(nextTenant);
    tokenService.setBranchProfile(nextBranchProfile);
    tokenService.setBranchRoleFlags(normalizedRoleFlags);
    setToken(accessToken);
    setUsername(username);
    setUserType(nextUserType);
    setPermissions(normalizedPermissions);
    setEnabledModules(normalizedEnabledModules);
    setTenant(nextTenant);
    setBranchProfileState(nextBranchProfile);
    setBranchRoleFlagsState(normalizedRoleFlags);
  };

  // Update just the branch profile (e.g., after admin reassigns the
  // current user to a different branch). Persists to storage so it
  // survives page reloads.
  const setBranchProfile = (next) => {
    tokenService.setBranchProfile(next);
    setBranchProfileState(next);
  };

  // Function to log out and clear stored token
  const logout = () => {
    tokenService.clearAuth();
    setToken(null);
    setUsername(null);
    setUserType(null);
    setPermissions([]);
    setEnabledModules([]);
    setTenant(null);
    setBranchProfileState(null);
    setBranchRoleFlagsState({
      branch_role: null,
      is_main_tenant_admin: false,
      is_branch_admin: false,
    });
  };

  return (
    <UserContext.Provider
      value={{
        token,
        username,
        userType,
        permissions,
        enabledModules,
        tenant,
        branchProfile,
        setBranchProfile,
        // Pull the flags out of the bag so consumers can destructure
        // `useContext(UserContext)` without an extra step.
        branchRole: branchRoleFlags.branch_role,
        isMainTenantAdmin: Boolean(branchRoleFlags.is_main_tenant_admin),
        isBranchAdmin: Boolean(branchRoleFlags.is_branch_admin),
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
