export type UnderTheSkyFormData = {
  // Step 1: About the Gathering
  planningType: string;
  planningOtherText?: string;
  occasionDetails?: string;
  preferredDate: string;
  expectedGuests: string;
  settingPreferences: string[];

  // Step 2: About You
  name: string;
  phoneNumber: string;
  emailAddress?: string;
};

export const INITIAL_UNDER_THE_SKY_FORM_DATA: UnderTheSkyFormData = {
  planningType: "",
  planningOtherText: "",
  occasionDetails: "",
  preferredDate: "",
  expectedGuests: "",
  settingPreferences: [],
  name: "",
  phoneNumber: "",
  emailAddress: "",
};

export const PLANNING_TYPES = [
  "Private dinner",
  "Wedding / pre-wedding gathering",
  "Birthday / milestone",
  "Family gathering",
  "Brunch",
  "Corporate dinner",
  "Brand activation",
  "Other",
];

export const SETTING_PREFERENCES = [
  "Under the trees",
  "Open lawn",
  "Long table",
  "Poolside",
  "Intimate indoor setting",
  "Garden setting",
  "Something a little unexpected",
  "Not sure yet",
];
