from app import app

# Vercel requires the app to be named 'app' or be in a variable
# This file serves as the entry point for Vercel
application = app

if __name__ == "__main__":
    app.run()
