rsync -r --verbose --exclude 'sys.kelvin'  --exclude  './mar/json.hoon' ./quoridor/desk/* ./fes/quoridor/
rsync -r --verbose --exclude 'sys.kelvin'  --exclude  './mar/json.hoon' ./quoridor/desk/* ./zod/quoridor/

# Note:  The sys.kelvin path is relative to the folder we pull from, hence the shortened path.
# Use the -n flag to do a dry run, and get a printout of what rsync intends to do.

# Betwen zuse 415K and 412K, the json.hoon file differs. So we exclude it!

