# 🚀 LeetLab

A modern coding platform inspired by LeetCode, built with a robust backend infrastructure and modern technologies.

## ✨ Features

- **User Management**
  - User registration and authentication
  - Profile management
  - Progress tracking

- **Problem Management**
  - Create and manage coding problems
  - Multiple difficulty levels
  - Rich problem descriptions
  - Test cases management

- **Code Execution**
  - Real-time code execution
  - Multiple programming language support
  - Instant feedback on submissions
  - Performance metrics

- **Learning Experience**
  - Problem categorization
  - Difficulty progression
  - Solution discussions
  - Learning paths

## 🛠 Tech Stack

### Backend
- **Container Orchestration**: Docker Compose
- **Database**: PostgreSQL
- **Code Execution**: Judge0
- **API**: RESTful architecture

### Infrastructure
- **Containerization**: Docker
- **Database Management**: PostgreSQL
- **Code Execution Engine**: Judge0

## 🚀 Getting Started

### Prerequisites
- Docker
- Docker Compose
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/leetlab.git
cd leetlab
```

2. Start the services:
```bash
docker-compose up -d
```

3. Access the application:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000`



### Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
POSTGRES_DB=leetlab
POSTGRES_USER=admin
POSTGRES_PASSWORD=your_password
JUDGE0_HOST=judge0
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Inspired by LeetCode
- Built with modern technologies
- Community-driven development
