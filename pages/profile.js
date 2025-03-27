import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Linkedin, Instagram } from "lucide-react";


export default function ProfilePage() {
    const { data: session } = useSession();
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

    useEffect(() => {
        if (session?.user?.email) {
            fetch(`/api/profile?email=${session.user.email}`)
                .then(res => res.json())
                .then(data => {
                    if (data.profile) {
                        setProfile({
                            fullName: data.profile.fullName || '',
                            email: data.profile.email || session.user.email,
                            image: data.profile.image || session.user.image || '',
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
        setImageFile(e.target.files[0]);
    };

    const handleSave = async () => {
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

        const data = await response.json();
        if (response.ok) {
            alert('Profile updated successfully!');
            setProfile(prev => ({ ...prev, image: data.profile.image }));
            setIsEditing(false);
        } else {
            alert(data.message);
        }
    };

    if (!session) return <p className="text-center text-gray-600">Please log in to view your profile.</p>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-3xl">
                {/* Profile Sections */}
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                    
                    {/* Left - Profile Image */}
                    <div className="flex-shrink-0">
                        <img
                            src={profile.image || "/default-profile.png"}
                            alt="Profile"
                            className="w-40 h-40 rounded-full border-4 border-gray-300 shadow-md object-cover"
                        />
                        {isEditing && <input type="file" onChange={handleImageChange} className="mt-2" />}
                    </div>

                    {/* Right - Profile Details */}
                    <div className="flex-1 text-center md:text-left">
                        {isEditing ? (
                            <input 
                                type="text" 
                                name="fullName" 
                                value={profile.fullName} 
                                onChange={handleChange} 
                                className="w-full p-2 border rounded-lg text-lg font-bold focus:ring-2 focus:ring-blue-400 text-center md:text-left" 
                            />
                        ) : (
                            <h2 className="text-2xl font-bold text-gray-800">{profile.fullName || 'N/A'}</h2>
                        )}

                        {/* Location - Editable */}
                        <div className="mt-2 flex justify-center md:justify-start items-center space-x-2">
                            <span className="text-gray-600">📍</span>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    name="location" 
                                    value={profile.location} 
                                    onChange={handleChange} 
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400" 
                                />
                            ) : (
                                <span className="text-gray-600">{profile.location || "Location not provided"}</span>
                            )}
                        </div>

                        {/* Social Links (Only LinkedIn & Instagram) */}
                        <div className="flex justify-center md:justify-start mt-4 space-x-4">
                            {isEditing ? (
                                <>
                                    <input 
                                        type="text" 
                                        name="socialLinks.linkedin" 
                                        value={profile.socialLinks.github} 
                                        onChange={handleChange} 
                                        placeholder="LinkedIn URL"
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                                    />
                                    <input 
                                        type="text" 
                                        name="socialLinks.instagram" 
                                        value={profile.socialLinks.github} 
                                        onChange={handleChange} 
                                        placeholder="Instagram URL"
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                                    />
                                </>
                            ) : (
                                <>
                                    {profile.socialLinks.linkedin && (
                                        <a
                                            href={profile.socialLinks.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:opacity-80"
                                        >
                                            <Linkedin size={28} className="text-blue-600" />
                                        </a>
                                    )}
                                    {profile.socialLinks.github && (
                                        <a
                                            href={profile.socialLinks.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:opacity-80"
                                        >
                                            <Instagram size={28} className="text-pink-500" />
                                        </a>
                                    )}

                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bio Section */}
                <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-semibold text-gray-800">Bio</h3>
                    {isEditing ? (
                        <textarea
                            name="bio"
                            value={profile.bio}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                        />
                    ) : (
                        <p className="text-gray-600 mt-2">{profile.bio || "No bio available"}</p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6">
                    {isEditing ? (
                        <div className="flex space-x-2">
                            <button onClick={handleSave} className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">Save Profile</button>
                            <button onClick={() => setIsEditing(false)} className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition">Cancel</button>
                        </div>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition">Edit Profile</button>
                    )}
                </div>
            </div>
        </div>
    );
}
