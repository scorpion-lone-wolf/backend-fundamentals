RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color (reset)

# Prompting user to enter username and password

# -p : prompt the user with a message
# -s : silent mode, does not display the input on the terminal (useful for hiding passwords)
read -p "$(echo "${GREEN}Enter username: ${NC}")" username
read -s -p "$(echo "${RED}Enter password: ${NC}")" password
echo

echo  "${GREEN}User entered: $username${NC}"
