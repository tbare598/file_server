from bottle import static_file
from os.path import abspath, commonprefix, isdir, isfile, dirname
from os import listdir
from re import findall


def get_path_type(root, path):
    req_path_abs = abspath(root + '/' + path)
    if commonprefix([req_path_abs, root]) == root:
        if isfile(req_path_abs):
            return "FILE"
        if isdir(req_path_abs):
            return "DIR"

    return None


def get_static_file(root, path):
    req_path_abs = abspath(root + '/' + path)
    if commonprefix([req_path_abs, root]) == root and isfile(req_path_abs):
        return static_file(path, root=root)

    return None


def get_directory_listing(root, path):
    req_path_abs = abspath(root + '/' + path)
    if commonprefix([req_path_abs, root]) == root:
        if isfile(req_path_abs):
            req_path_abs = dirname(req_path_abs)
        elif not isdir(req_path_abs):
            return None

        files_and_dirs = listdir(req_path_abs)

        files = []
        directories = []
        if(root != req_path_abs):
            directories.append('..')

        for thing in files_and_dirs:
            if(isdir(req_path_abs + '/' + thing)):
                directories.append(thing)
            elif isfile(req_path_abs + '/' + thing):
                files.append(thing)

        thePath = req_path_abs[len(root):]
        thePath = findall('[^\\\/]+', thePath)
        return {
            "path": thePath,
            "directories": directories,
            "files": files
        }

    return None
