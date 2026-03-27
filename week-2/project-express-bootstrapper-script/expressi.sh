#!/bin/bash

# color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color (reset)

#  Prompting user to enter the name of the project name
read -p "Enter the name of your project: " project_name
# Validate the project name : User should not enter an empty name

#  check if the project name is empty or empty string
if [[ -z "$project_name" ]]; then
    echo -e "${RED}Error: Project name cannot be empty. Please enter a valid project name.${NOCOLOR}"
    exit 1
fi

#  check if project directory already exists
if [[ -d "$project_name" ]]; then
    echo -e "${RED}Error: Project directory '$project_name' already exists.${NOCOLOR}"
    exit 1
fi

# Creating a new directory with the project name
echo -e "${BLUE}Creating project directory...${NC}"
mkdir "$project_name"
cd "$project_name"

# Initializing a new npm project
echo -e "${BLUE}Initializing package.json...${NC}"
npm init -y

# adding "types": "module" to package.json
echo -e "${BLUE}Configuring package.json for ES modules...${NC}"

# sed command to add "type": "module" to package.json
sed -i '' 's/^{/{\n  "type": "module",/' package.json

# sed command to add "start" and "dev" scripts to package.json
sed -i '' '/"scripts": {/{n; s/.*/  "dev": "nodemon index.js",\
  "start": "node index.js",\
&/; }' package.json

# installing dependencies (express,nodemon,dotenv,cors,morgan)
echo -e "${BLUE}Installing Express...${NC}"
npm install express
echo -e "${BLUE}Installing Nodemon...${NC}"
npm install --save-dev nodemon
echo -e "${BLUE}Installing Dotenv...${NC}"
npm install dotenv
echo -e "${BLUE}Installing CORS...${NC}"
npm install cors
echo -e "${BLUE}Installing Morgan...${NC}"
npm install morgan

# Creating folder structure
echo -e "${BLUE}Creating Folder Structure...${NC}"
mkdir -p src/{routes,controllers,middleware,config}

# Creating .env file
echo -e "${BLUE}Creating .env file ...${NC}"
cat > .env <<EOF
PORT=3000
NODE_ENV=development
EOF

# crating .gitignore
echo -e "${BLUE}Creating .gitignore file ...${NC}"
cat > .gitignore <<EOF
node_modules/
.env
.DS_Store
EOF

# Creating Sever.js
echo -e "${BLUE}Creating server.js file ...${NC}"
cat > src/server.js << 'EOF'
// server.js

const express = require('express');
const app = express();

// ✅ Middleware
app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: true })); // parse form data

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

// ✅ Example API route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello World 👋' });
});

// ✅ 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
EOF


echo -e "${GREEN}Project Setup completed!${NC}"
