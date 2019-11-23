from time import sleep
from os import system, path, remove, chdir, getcwd

class chrome(object):
    def __init__(self, PATH):
        self.cleanup()       # Make sure everything is cleaned up before starting the install
        self.PATH = PATH        # Path to the chrome installs

    def getPath(self):
        command = f"dir \"{self.PATH}\" >> tmp"     # List the directories in the google folder
        system(command)

        with open("tmp", "r") as f:
            data = f.read()

        data = [item.split("<DIR>")[-1].strip() for item in data.split("\n") if "Chrome" in item]   # Get all the folders with the word Chrome in it
        
        for i in range(len(data)):
            print(f"{i + 1}. {data[i]}")    # Print all the chrome installs

        while True:
            selection = input()  # Get user input for install location
            try:
                selection = int(selection)
                if selection < len(data) + 1:
                    break
            except: continue
        self.PATH = f"\"\"{self.PATH}\\{data[selection - 1]}\\Application\\chrome.exe\"\""  # Set the path to the chrome exe to install to
        self.SRC = "\\".join(getcwd().split("\\")[:-1]) + "\\src"   # Find the src folder for the extension
        system("cls")

    def install(self):
        print("Please exit all open instances of chrome...")
        while True:     # Wait until all instance of chrome are closed
            self.cleanup()
            system("tasklist >> tmp")
            sleep(1)
            with open("tmp", "r") as f:
                data = f.read()
            if "chrome.exe" not in data:
                break
        system("cls")
        system("taskkill /f /im chrome.exe >> tmp")     # Just to make sure there are no straggling processes taskkill them
        print("Installing...")
        command = f"{self.PATH} --load-extension={self.SRC}"  # TODO figure out method to load the extenions that saves
        system(command)
        system("cls")      

    def cleanup(self):
        if path.exists("tmp"):
            remove("tmp")

if __name__ == '__main__':
    chrome = chrome("%ProgramFiles(x86)%\\Google")
    chrome.getPath()
    chrome.install()
    chrome.cleanup()
    print("AutoEP Installion Successful")
    system("pause")