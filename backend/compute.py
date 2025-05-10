import os
import sys
from pathlib import Path

def get_file_size(file_path):
    """Get the size of a file in bytes."""
    try:
        return os.path.getsize(file_path)
    except OSError:
        return 0

def is_text_file(file_path):
    """Check if a file is a text file based on common extensions."""
    text_extensions = {
        '.txt', '.py', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.scss', 
        '.json', '.md', '.yml', '.yaml', '.xml', '.sql', '.sh', '.bat', '.cmd',
        '.env', '.gitignore', '.editorconfig', '.eslintrc', '.prettierrc'
    }
    return Path(file_path).suffix.lower() in text_extensions

def calculate_project_size(start_path='.'):
    """Calculate the total size of all text files in the project."""
    total_size = 0
    file_count = 0
    file_sizes = []

    # Convert start_path to absolute path
    start_path = os.path.abspath(start_path)

    for root, dirs, files in os.walk(start_path):
        # Skip node_modules directory
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        
        for file in files:
            file_path = os.path.join(root, file)
            
            if is_text_file(file_path):
                size = get_file_size(file_path)
                if size > 0:
                    total_size += size
                    file_count += 1
                    file_sizes.append((file_path, size))

    return total_size, file_count, file_sizes

def format_size(size_bytes):
    """Convert size in bytes to human readable format."""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} TB"

def main():
    # Get the project root directory (one level up from the script location)
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    print(f"\nAnalyzing project at: {project_root}")
    print("-" * 50)
    
    total_size, file_count, file_sizes = calculate_project_size(project_root)
    
    # Sort files by size (largest first)
    file_sizes.sort(key=lambda x: x[1], reverse=True)
    
    print(f"\nTotal number of text files: {file_count}")
    print(f"Total size: {format_size(total_size)}")
    print("\nTop 10 largest files:")
    print("-" * 50)
    
    for file_path, size in file_sizes[:10]:
        relative_path = os.path.relpath(file_path, project_root)
        print(f"{format_size(size):>10} - {relative_path}")

if __name__ == "__main__":
    main()
