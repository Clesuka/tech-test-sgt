Tech Test SGT

This repository is a full-stack technical test project with separate front-end and back-end folders.
Each part runs independently but works together as one system.


---

🧮 System Requirements

Make sure the following are installed on your system:

Git – to clone the repository

Node.js (v18 or newer recommended)

npm (comes with Node.js)

Modern web browser – for running and testing the app


> 💡 You can check your versions with:

node -v
npm -v




---

⚙️ Installation

Clone this repository and install dependencies for both the front-end and back-end.

# 1. Clone the repository
git clone https://github.com/Clesuka/tech-test-sgt.git

# 2. Move into the project folder
cd tech-test-sgt

Install Dependencies

Front-End

cd front-end
npm install

Back-End

cd ../back-end
npm install


---

🚀 Running the Project

You’ll need to run both the front-end and back-end in separate terminals.

Run Back-End

cd back-end
npm run dev

Run Front-End

cd front-end
npm run dev

Once both servers are running, open your browser and visit:

🔗 http://localhost:3000/products


---

🧩 Tips

If the npm run dev command doesn’t work, check the package.json scripts for the correct command.

You can run both servers together using concurrently:

npm install -g concurrently
concurrently "npm run dev --prefix back-end" "npm run dev --prefix front-end"

If you encounter a port conflict, change the port number in the configuration or .env file.



---

📂 Project Structure

tech-test-sgt/
├── front-end/     # Front-end app (React / Next.js)
├── back-end/      # Back-end API (Node.js / Express)
└── README.md


---

👤 Author

Weldy Flaminggo (Clesuka)
💼 GitHub


---

🖍️ License

This project is created for a technical test purpose only.
Feel free to explore, but not for commercial