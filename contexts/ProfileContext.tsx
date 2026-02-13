import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface ProfileData {
  // Basic Profile
  name: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  profileImageUri: string;
  // Residence
  address: string;
  postalCode: string;
  province: string;
  citizenshipStatus: string;
  // Household (for future use)
  householdSize: string;
  familyComposition: string;
  annualFamilyNetIncome: string;
  // Family/Guardian (for future use)
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  // Education
  highestEducation: string;
  highSchoolName: string;
  graduationDate: string;
  tradeSchoolName: string;
  tradeProgramName: string;
  tradeGraduationDate: string;
  trade: string;
  apprenticeshipLevel: string;
}

interface ProfileContextType {
  profileData: ProfileData;
  updateProfileData: (data: Partial<ProfileData>) => void;
  resetProfileData: () => void;
}

const defaultProfileData: ProfileData = {
  name: "",
  dateOfBirth: "",
  gender: "",
  phone: "",
  email: "",
  address: "",
  postalCode: "",
  province: "",
  citizenshipStatus: "",
  householdSize: "",
  familyComposition: "",
  annualFamilyNetIncome: "",
  guardianName: "",
  guardianPhone: "",
  guardianEmail: "",
  highestEducation: "",
  highSchoolName: "",
  graduationDate: "",
  tradeSchoolName: "",
  tradeProgramName: "",
  tradeGraduationDate: "",
  trade: "",
  apprenticeshipLevel: "",
  profileImageUri: "",
};

export const demoProfileData: ProfileData = {
  name: "Jisoo Jang",
  dateOfBirth: "2001-09-14",
  gender: "Female",
  phone: "604-555-0192",
  email: "jisoo.jang@example.com",
  address: "1234 Main St",
  postalCode: "V5K 0A1",
  province: "British Columbia",
  citizenshipStatus: "Permanent Resident",
  householdSize: "3",
  familyComposition: "Self, parent, sibling",
  annualFamilyNetIncome: "$48,000",
  guardianName: "Min Jang",
  guardianPhone: "604-555-0177",
  guardianEmail: "min.jang@example.com",
  highestEducation: "Trade School",
  highSchoolName: "Vancouver Technical Secondary",
  graduationDate: "2019-06-20",
  tradeSchoolName: "BCIT",
  tradeProgramName: "Electrical Foundation",
  tradeGraduationDate: "2024-05-15",
  trade: "Electrician",
  apprenticeshipLevel: "Level 2",
  profileImageUri: "",
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);
const STORAGE_KEY = "@profile_data";
const DEMO_MODE = process.env.EXPO_PUBLIC_DEMO_MODE === "1";

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profileData, setProfileData] = useState<ProfileData>(defaultProfileData);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from storage on mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Keep the default shape but hydrate with anything we previously saved.
        setProfileData({ ...defaultProfileData, ...parsedData });
      } else if (DEMO_MODE) {
        setProfileData(demoProfileData);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(demoProfileData));
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfileData = async (data: ProfileData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving profile data:", error);
    }
  };

  const updateProfileData = (data: Partial<ProfileData>) => {
    setProfileData((prev) => {
      const updated = { ...prev, ...data };
      // Persist on every change so the UI stays in sync with storage.
      saveProfileData(updated);
      return updated;
    });
  };

  const resetProfileData = async () => {
    setProfileData(defaultProfileData);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error resetting profile data:", error);
    }
  };

  return (
    <ProfileContext.Provider
      value={{ profileData, updateProfileData, resetProfileData }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
