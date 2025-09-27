"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select, { SingleValue } from "react-select";
import countryList from "react-select-country-list";
import { useRouter } from "next/navigation";
import moment from "moment-timezone";

// ✅ Types
interface ProfileFormData {
  fullName: string;
  nickName: string;
  gender: string;
  country: string;
  language: string;
  timeZone: string;
}

// ✅ Type for dropdowns
type OptionType = {
  value: string;
  label: string;
};

// ✅ Validation schema
const schema = yup.object().shape({
  fullName: yup.string().required("Full Name is required"),
  nickName: yup.string().required("Nick Name is required"),
  gender: yup.string().required("Gender is required"),
  country: yup.string().required("Country is required"),
  language: yup.string().required("Language is required"),
  timeZone: yup.string().required("Time Zone is required"),
});

export default function MyProfile() {
  const router = useRouter();
  const [userPhoto, setUserPhoto] = useState<string>("/herosec.png");
  const [userName, setUserName] = useState<string>("User");
  const [userEmail, setUserEmail] = useState<string>("user@email.com");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
  });

  // Dropdown data
  const countries: OptionType[] = useMemo(() => countryList().getData(), []);
  const genderOptions: OptionType[] = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];
  const languageOptions: OptionType[] = [
    { value: "en", label: "English" },
    { value: "ar", label: "Arabic" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "es", label: "Spanish" },
  ];
  const timeZones: OptionType[] = useMemo(
    () =>
      moment.tz.names().map((tz) => ({
        value: tz,
        label: tz,
      })),
    []
  );

  // Load user info + detect timezone
  useEffect(() => {
    const name = localStorage.getItem("name") || "User";
    const email = localStorage.getItem("email") || "user@email.com";
    const image = localStorage.getItem("image") || "/herosec.png";

    setUserName(name);
    setUserEmail(email);
    setUserPhoto(image);

    // ✅ Detect default timezone
    const detectedTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detectedTZ) {
      setValue("timeZone", detectedTZ);
    }
  }, [setValue]);

  // On submit
  const onSubmit = (data: ProfileFormData) => {
    console.log("✅ Submitted Profile:", data);
    router.push("/providerview/dashBoardHome/pendingApprove");
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-100 rounded-xl shadow">
      <h2 className="text-blue-600 font-semibold text-xl mb-6">My profile</h2>

      {/* Top section with image + name + email */}
      <div className="flex items-center gap-4 mb-8">
        <img
          src={userPhoto}
          alt="User Avatar"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="font-bold text-lg">{userName}</h3>
          <p className="text-gray-500">{userEmail}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Full Name
          </label>
          <input
            type="text"
            {...register("fullName")}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName.message}</p>
          )}
        </div>

        {/* Nick Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Nick Name
          </label>
          <input
            type="text"
            {...register("nickName")}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.nickName && (
            <p className="text-red-500 text-sm">{errors.nickName.message}</p>
          )}
        </div>

        {/* Gender Dropdown */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Gender</label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select
                options={genderOptions}
                value={genderOptions.find((g) => g.value === field.value) || null}
                onChange={(val: SingleValue<OptionType>) =>
                  field.onChange(val?.value)
                }
                placeholder="Select gender"
              />
            )}
          />
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender.message}</p>
          )}
        </div>

        {/* Country Dropdown */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Country</label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Select
                options={countries}
                value={countries.find((c) => c.value === field.value) || null}
                onChange={(val: SingleValue<OptionType>) =>
                  field.onChange(val?.value)
                }
                placeholder="Select country"
              />
            )}
          />
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country.message}</p>
          )}
        </div>

        {/* Language Dropdown */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Language</label>
          <Controller
            name="language"
            control={control}
            render={({ field }) => (
              <Select
                options={languageOptions}
                value={
                  languageOptions.find((l) => l.value === field.value) || null
                }
                onChange={(val: SingleValue<OptionType>) =>
                  field.onChange(val?.value)
                }
                placeholder="Select language"
              />
            )}
          />
          {errors.language && (
            <p className="text-red-500 text-sm">{errors.language.message}</p>
          )}
        </div>

        {/* Time Zone Dropdown */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Time Zone</label>
          <Controller
            name="timeZone"
            control={control}
            render={({ field }) => (
              <Select
                options={timeZones}
                value={timeZones.find((t) => t.value === field.value) || null}
                onChange={(val: SingleValue<OptionType>) =>
                  field.onChange(val?.value)
                }
                placeholder="Select time zone"
              />
            )}
          />
          {errors.timeZone && (
            <p className="text-red-500 text-sm">{errors.timeZone.message}</p>
          )}
        </div>

        {/* Submit button */}
        <div className="col-span-2 flex justify-end mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Footer Note */}
      <p className="mt-6 text-gray-500 text-sm">
        Users can see your profile and it may appear across Skava to help us
        build trust in our community
      </p>
    </div>
  );
}