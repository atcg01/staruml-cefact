import shutil
import os

def main():

    # remove the extension
    try:
      shutil.rmtree('C:/Users/Nicolas/AppData/Roaming/StarUML/extensions/user/gs-gs.staruml-cefact')

    except:
      print("extension not installed")

    # copy files to extension path
    source = 'C:/Users/Nicolas/Documents/Wisper/Code/staruml-cefact/'
    destination = 'C:/Users/Nicolas/AppData/Roaming/StarUML/extensions/user/gs-gs.staruml-cefact'

    shutil.copytree(source, destination)
    
 
 
if __name__ == '__main__':
    main()
