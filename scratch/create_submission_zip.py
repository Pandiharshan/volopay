import os
import zipfile

zip_filename = 'Signal_Desk_Submission.zip'
if os.path.exists(zip_filename):
    os.remove(zip_filename)

include_dirs = ['app', 'data', 'exports', 'slides', 'scripts']
include_files = [
    'index.html',
    'README.md',
    'DEPLOYMENT.md',
    'TEST_REPORT.md',
    'submission_manifest.json',
    'package.json',
    'ASSIGNMENT.md',
    'DATA_CONTRACT.md',
    'DATA_DICTIONARY.md',
    'START_HERE.md',
    'SUBMISSION_CHECKLIST.md'
]

print(f"Creating {zip_filename}...")
file_count = 0

with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for filename in include_files:
        if os.path.exists(filename):
            zipf.write(filename, os.path.join('01_Revenue_Intelligence_Inbox', filename))
            file_count += 1
            print(f"Added file: {filename}")
            
    for dirname in include_dirs:
        if os.path.exists(dirname):
            for root, dirs, files in os.walk(dirname):
                for f in files:
                    full_path = os.path.join(root, f)
                    rel_path = os.path.relpath(full_path, '.')
                    archive_path = os.path.join('01_Revenue_Intelligence_Inbox', rel_path)
                    zipf.write(full_path, archive_path)
                    file_count += 1

print(f"Successfully created {zip_filename} with {file_count} files!")
size_mb = os.path.getsize(zip_filename) / (1024 * 1024)
print(f"Zip archive size: {size_mb:.2f} MB")
