
# SciRoom Application

SciRoom is a social network designed to foster the exchange of information and ideas in science and technology. It is a dynamic platform for students, educators, and professionals to share knowledge through articles, discussions, and multimedia resources.

## Key Features

- **User Authentication**: Users can register and log in using their email and password, ensuring secure access.

- **For Regular Users**:
  - **View and Interact**: Browse scientific articles shared by other users and like or comment on articles of interest.
  - **Content Creation**: Write and share your own articles, with support for HTML formatting to make your content structured and visually appealing.
  - **Multimedia Support**: Upload photos and videos along with your articles for better engagement.
  - **Content Reporting**: Report any articles containing unethical or inappropriate content.
  - **Professor Verification**: Verified professors are marked with a blue tick, giving their content credibility.
  - **Content Moderation**: Ability to block offensive, violent, or sensitive comments or articles.
  - **Infinite Scroll & Pagination**: For smooth navigation and better data transmission efficiency.
- **For Admins**:
  - **User and Content Management**: View statistics on total users and articles, search users by email, and manage reports of content violations.
  - **User Blocking**: Admins can block users who violate ethical standards or frequently use violent language.
  - **Report Handling**: Admins can review reports and delete violating posts from the system.

### Technology Stack

- **React Native**: Powers the cross-platform development, enabling the application to run smoothly on both iOS and Android devices.
- **Redux Toolkit**: Manages global state efficiently, ensuring that user actions, like liking articles or commenting, update instantly across the app.

- **Supabase**:
  - **Authentication**: Secure and scalable user authentication with email and password, allowing easy user management.
  - **Realtime Database**: Provides live updates to articles, comments, and likes, allowing users to interact with the latest information instantly.
  - **File Storage**: Supports the storage and retrieval of multimedia content, such as images and videos, ensuring users can upload and access rich content with ease.
