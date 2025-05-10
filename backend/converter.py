import requests

def convert_pptx_to_pdf(input_path: str, output_path: str):
    with open(input_path, 'rb') as f:
        files = {'file': f}
        data = {'convert-to': 'pdf'}
        resp = requests.post("http://unoserver:2004/request", files=files, data=data, stream=True)
        resp.raise_for_status()
        with open(output_path, 'wb') as out:
            for chunk in resp.iter_content(1024):
                out.write(chunk)
