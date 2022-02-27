import webview
import time

class Api:
    def findFile(self):
        file_types = ('Image Files (*.mp4)', 'All files (*.*)')
        data = window.create_file_dialog(webview.OPEN_DIALOG, allow_multiple=True, file_types=file_types)
        response = {
            'message': 'true',
            'data': data
        }
        return response
    def openFile(self, filename):
        response = {
            'message': 'true',
            'data': filename
        }
        return response
    def readDatabase(self):
        # Read Database
        response = {
            'message': "false",
            "data": {}
        }
        return response
    def saveDatabase(self):
        # Save Database
        response = {
            'message': "false",
            "data": {}
        }
        return response
    def exportProject(self):
        response = {
            'message': "false",
            "data": {}
        }
        return response
    def saveCurrentProject(self, currentProject):
        # Save current project
        response = {
            'message': currentProject
        }
        return response
    def openExternalUrl(self, data):
        response = {
            'message': data
        }
        return response
    # change url:
if __name__ == '__main__':
    api = Api()
    window = webview.create_window('DeathMark 💀', '../dist/index.html', js_api=api)
    # webview.start(change_url, window)
    webview.start(debug=True)
