import requests
import os

UNOSERVER_ADDRESS = os.environ["UNOSERVER_ADDRESS"]

def convert_pptx_to_pdf(input_path: str, output_path: str):
    with open(input_path, 'rb') as f:
        files = {'file': f}
        data = {'convert-to': 'pdf'}
        resp = requests.post(UNOSERVER_ADDRESS, files=files, data=data, stream=True)
        resp.raise_for_status()
        with open(output_path, 'wb') as out:
            for chunk in resp.iter_content(1024):
                out.write(chunk)
