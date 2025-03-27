import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
    const { data: session } = useSession();
    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        image: '',
        bio: '',
        location: '',
        website: '',
        socialLinks: { twitter: '', linkedin: '', github: '' },
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (session?.user?.email) {
            fetch(`/api/profile?email=${session.user.email}`)
                .then(res => res.json())
                .then(data => {
                    console.log("Fetched Profile Data:", data);
                    if (data.profile) {
                        setProfile({
                            fullName: data.profile.fullName || '',
                            email: data.profile.email || session.user.email,
                            image: data.profile.image || session.user.image || '',
                            bio: data.profile.bio || '',
                            location: data.profile.location || '',
                            website: data.profile.website || '',
                            socialLinks: data.profile.socialLinks || { twitter: '', linkedin: '', github: '' },
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
            setProfile((prev) => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, [key]: value || '' }
            }));
        } else {
            setProfile((prev) => ({ ...prev, [name]: value || '' }));
        }
    };

    const handleSave = async () => {
        const response = await fetch('/api/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Profile updated successfully!');
            setIsEditing(false);
        } else {
            alert(data.message);
        }
    };

    if (!session) return <p className="text-center text-gray-600">Please log in to view your profile.</p>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-lg">
                <div className="flex flex-col items-center">
                    {profile.image && (
                        <img src={profile.image} alt="Profile" className="w-24 h-24 rounded-full border-4 border-gray-300" />
                    )}
                    {isEditing ? (
                        <input type="text" name="fullName" value={profile.fullName} onChange={handleChange}
                            className="mt-2 w-full p-2 border rounded-lg text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    ) : (
                        <h1 className="text-xl font-bold mt-4">{profile.fullName || 'N/A'}</h1>
                    )}
                    <p className="text-sm text-gray-600 mt-1">{profile.email || 'N/A'}</p>
                </div>

                <hr className="my-4 border-gray-300" />

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Bio:</label>
                        <input type="text" name="bio" value={profile.bio} onChange={handleChange}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" disabled={!isEditing} />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Location:</label>
                        <input type="text" name="location" value={profile.location} onChange={handleChange}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" disabled={!isEditing} />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Website:</label>
                        <input type="text" name="website" value={profile.website} onChange={handleChange}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" disabled={!isEditing} />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-700 mt-4">Social Links</h3>

                    <div>
                        <label className="block text-gray-700 font-medium">Twitter:</label>
                        <input type="text" name="socialLinks.twitter" value={profile.socialLinks?.twitter} onChange={handleChange}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" disabled={!isEditing} />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">LinkedIn:</label>
                        <input type="text" name="socialLinks.linkedin" value={profile.socialLinks?.linkedin} onChange={handleChange}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" disabled={!isEditing} />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">GitHub:</label>
                        <input type="text" name="socialLinks.github" value={profile.socialLinks?.github} onChange={handleChange}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" disabled={!isEditing} />
                    </div>

                    {isEditing ? (
                        <div className="flex space-x-2">
                            <button onClick={handleSave}
                                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-600 transition duration-300">
                                Save Profile
                            </button>
                            <button onClick={() => setIsEditing(false)}
                                className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg mt-4 hover:bg-gray-500 transition duration-300">
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setIsEditing(true)}
                            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg mt-4 hover:bg-green-600 transition duration-300">
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
