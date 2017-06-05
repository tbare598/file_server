from bottle import static_file
from os.path import abspath, commonprefix, isdir, isfile
from os import listdir


def get_static_file(root, path):
    req_path_abs = abspath(root + '/' + path)
    if commonprefix([req_path_abs, root]) == root and isfile(req_path_abs):
        return static_file(path, root=root)

    return None


def get_directory_listing(root, path):
    req_path_abs = abspath(root + '/' + path)
    if commonprefix([req_path_abs, root]) == root and isdir(req_path_abs):
        files_and_dirs = listdir(req_path_abs)

        directories = []
        files = []
        for thing in files_and_dirs:
            if(isdir(req_path_abs + '/' + thing)):
                directories.append(thing)
            elif isfile(req_path_abs + '/' + thing):
                files.append(thing)

        return {
            "directories": directories,
            "files": files
        }

    return None
