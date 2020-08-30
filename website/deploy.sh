# activate virtualenv
echo "Activating virtualenv..."
source ../venv/bin/activate

# compile react code
echo "Compiling React code..."
cd frontend || { echo "Error: frontend folder not found!"; exit 1; }
npm run build
cd ../

# collect django static files
echo "Collecting django static files.."
python manage.py collectstatic --noinput

# reassign ownership of relevant files to apache2 (git may have modified ownership by overwriting files)
echo "Reassigning ownership to apache2..."
sudo chown :www-data .
sudo chown :www-data db.sqlite3
sudo chown :www-data -R media/

# restart server
echo "Restarting server..."
sudo service apache2 restart
