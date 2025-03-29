import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Linkedin, Instagram } from "lucide-react";

export default function ProfilePage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        image: '',
        bio: '',
        location: '',
        website: '',
        socialLinks: { instagram: '', linkedin: '' },
    });
    const [isEditing, setIsEditing] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

    useEffect(() => {
        if (session?.user?.email) {
            fetch(`/api/profile?email=${session.user.email}`)
                .then(res => res.json())
                .then(data => {
                    if (data.profile) {
                        setProfile({
                            fullName: data.profile.fullName || '',
                            email: data.profile.email || session.user.email,
                            image: data.profile.image || session.user.image || '/default-profile.png',
                            bio: data.profile.bio || '',
                            location: data.profile.location || '',
                            website: data.profile.website || '',
                            socialLinks: data.profile.socialLinks || { instagram: '', linkedin: '' },
                        });
                    }
                })
                .catch(err => console.error("Error fetching profile:", err));
        }
    }, [session]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('socialLinks.')) {
            const key = name.split('.')[1];
            setProfile(prev => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, [key]: value }
            }));
        } else {
            setProfile(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfile(prev => ({ ...prev, image: event.target.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const formatUrl = (url) => {
        if (!url) return '';
        url = url.trim();
        return url.startsWith('http') ? url : `https://${url}`;
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('email', profile.email);
            formData.append('fullName', profile.fullName);
            formData.append('bio', profile.bio);
            formData.append('location', profile.location);
            formData.append('website', profile.website);
            formData.append('socialLinks', JSON.stringify(profile.socialLinks));
            if (imageFile) formData.append('image', imageFile);

            const response = await fetch('/api/profile', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const data = await response.json();
            setProfile(prev => ({ ...prev, ...data.profile }));
            setIsEditing(false);
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to update profile: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = async () => {
        if (!showSignOutConfirm) {
            setShowSignOutConfirm(true);
            return;
        }

        setIsLoading(true);
        try {
            await signOut({ redirect: false });
            router.push('/login');
        } catch (error) {
            console.error('Sign out error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!session) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-center text-gray-600">
                    Please log in to view your profile.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-8">
                    {/* Profile Header */}
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                        {/* Profile Image */}
                        <div className="flex-shrink-0">
                            <div className="relative w-24 h-24">
                                <img
                                    src={profile.image}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover border-2 border-gray-200"
                                />
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md border border-gray-200 cursor-pointer hover:bg-gray-50">
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className="h-5 w-5 text-blue-500" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <input 
                                            type="file" 
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left">
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="fullName"
                                    value={profile.fullName}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    className="w-full text-2xl font-bold mb-2 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                            ) : (
                                <h1 className="text-2xl font-bold text-gray-800">
                                    {profile.fullName || 'No Name Provided'}
                                </h1>
                            )}

                            <p className="text-gray-600 mb-4">{profile.email}</p>

                            {/* Location */}
                            <div className="flex items-center justify-center md:justify-start mb-4">
                                <span className="text-gray-500 mr-2">📍</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="location"
                                        value={profile.location}
                                        onChange={handleChange}
                                        placeholder="Your Location"
                                        className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <span className="text-gray-600">
                                        {profile.location || 'Location not specified'}
                                    </span>
                                )}
                            </div>

                            {/* Social Links */}
                            <div className="flex justify-center md:justify-start space-x-4">
                                {isEditing ? (
                                    <div className="grid grid-cols-1 gap-3 w-full">
                                        <div className="flex items-center gap-2">
                                            <Linkedin size={20} className="text-blue-600 flex-shrink-0" />
                                            <input
                                                type="url"
                                                name="socialLinks.linkedin"
                                                value={profile.socialLinks.linkedin}
                                                onChange={handleChange}
                                                placeholder="linkedin.com/in/username"
                                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Instagram size={20} className="text-pink-500 flex-shrink-0" />
                                            <input
                                                type="url"
                                                name="socialLinks.instagram"
                                                value={profile.socialLinks.instagram}
                                                onChange={handleChange}
                                                placeholder="instagram.com/username"
                                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {profile.socialLinks.linkedin && (
                                            <a
                                                href={formatUrl(profile.socialLinks.linkedin)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                <Linkedin size={24} />
                                            </a>
                                        )}
                                        {profile.socialLinks.instagram && (
                                            <a
                                                href={formatUrl(profile.socialLinks.instagram)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-pink-500 hover:text-pink-600"
                                            >
                                                <Instagram size={24} />
                                            </a>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bio  */}

                    <div className="mt-3 border-t pt-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Bio</h2>
                        {isEditing ? (
                            <textarea
                                name="bio"
                                value={profile.bio}
                                onChange={handleChange}
                                placeholder="Tell us about yourself..."
                                rows={4}
                                maxLength={200} // Limits input to 200 characters
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                            />
                        ) : (
                            <p className="text-gray-600 whitespace-pre-line">
                                {profile.bio || 'No bio provided'}
                            </p>
                        )}
                    </div>

                    {/* Website Section */}
                    <div className="mt-2 border-t pt-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Website</h2>
                        {isEditing ? (
                            <input
                                type="url"
                                name="website"
                                value={profile.website}
                                onChange={handleChange}
                                placeholder="https://example.com"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        ) : profile.website ? (
                            <a
                                href={formatUrl(profile.website)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                {profile.website}
                            </a>
                        ) : (
                            <p className="text-gray-600">No website provided</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex justify-between">
                        {isEditing ? (
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Edit Profile
                            </button>
                        )}

                        {showSignOutConfirm ? (
                            <div className="flex items-center space-x-2">
                                <p className="text-sm text-gray-600">Are you sure?</p>
                                <button
                                    onClick={() => setShowSignOutConfirm(false)}
                                    className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSignOut}
                                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Signing out...' : 'Sign Out'}
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleSignOut}
                                className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 border border-red-200 rounded-md hover:bg-red-50"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                                Sign Out
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}