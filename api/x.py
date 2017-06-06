from webservices.files.Files import get_static_file, get_directory_listing
import os

root = 'C:\\Users\\tbare\\Downloads'


print(get_directory_listing(root, 'temp/'))

# print(get_static_file('', root))
