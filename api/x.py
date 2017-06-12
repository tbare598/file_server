from webservices.files.Files import get_static_file, get_directory_listing
import os

root = 'C:\\Users\\tbare\\Downloads'
path = 'coop/Data'


print(get_directory_listing(root, path))

# print(get_static_file('', root))
