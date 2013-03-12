import os

rev = 1
source = '../dist/dom-lite.js'
build = '../dist/dom-lite.min.js'
header = '// dom-lite.js - https://github.com/stagas/dom-lite - MIT License\n'

os.system( 'java -jar compiler/compiler.jar --language_in=ECMASCRIPT5 --js ' + source + ' --js_output_file ' + build )

file = open( build, 'r' )
contents = file.read();
file.close()

file = open( build, 'w' )
file.write( header + contents )
file.close()
