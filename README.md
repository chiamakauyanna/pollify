# Pollify - Online Polling System

## Introduction

Pollify is an online polling system that allows users to create, manage, and participate in polls. The project is structured with a backend and frontend for seamless interaction.

## Repository Structure

```
pollify/
  ├── online-poll-system/  # Main application folder
```

## Features

- Create, edit, and delete polls
- Vote in polls
- View poll results
- Fetch active and past polls

## Tech Stack

- **Frontend:** React, Redux, TypeScript, TailwindCSS
- **State Management:** Redux Toolkit

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- Git

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/chiamakauyanna/pollify.git
   ```
2. Navigate to the project folder:
   ```sh
   cd pollify/online-poll-system
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Set up the environment variables by copying `.env.example` to `.env` and updating values as needed.
5. Start the development server:
   ```sh
   npm run dev
   ```

## API Endpoints

| Method | Endpoint                   | Description         |
| ------ | -------------------------- | ------------------- |
| GET    | /api/active-polls          | Fetch active polls  |
| GET    | /api/polls                 | Fetch all polls     |
| GET    | /api/polls/:id             | Fetch poll by ID    |
| POST   | /api/polls                 | Create a new poll   |
| PUT    | /api/polls/:id             | Update a poll       |
| DELETE | /api/polls/:id             | Delete a poll       |
| POST   | /api/votes                 | Vote in a poll      |
| GET    | /api/polls/:id/results     | Get poll results    |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m "Add feature"`)
4. Push to the branch (`git push origin feature-name`)
5. Open a pull request

## Contact

For any inquiries, reach out via email: [chiamakauyanna@gmail.com](mailto:chiamakauyanna@gmail.com)

## License

This project is licensed under the MIT License.

