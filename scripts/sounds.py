# pip install yt-dlp
# pip install requests
# pip install pydub
# pip install PyDrive2
# pip install openpyxl

# https://console.cloud.google.com/apis/credentials

from pydrive2.auth import GoogleAuth
from pydrive2.drive import GoogleDrive
import openpyxl
import json
from PIL import Image
from pydub import AudioSegment
import os
import re

def parse_excel_and_download():
  if not os.path.exists("tmp"):
    os.makedirs("tmp")

  with open("../html/sounds.json", "a+") as file:
    file.seek(0)
    try:
      main_sounds_json = json.load(file)
    except json.JSONDecodeError:
      main_sounds_json = []

  gauth = GoogleAuth()
  gauth.CommandLineAuth()
  gdrive = GoogleDrive(gauth)

  workbook = openpyxl.load_workbook("sounds.xlsx")
  worksheet = workbook["Form Responses 1"]

  used_filenames = []

  for row in worksheet.iter_rows(min_row=2):
    if all(cell.value is None for cell in row):
      break

    name = row[1].value
    bg = row[2].value
    sound = row[3].value
    category = row[4].value

    print(bg)

    file_paths = name.lower().replace(" ", "-")
    file_paths = re.sub(r"[^a-zA-Z0-9-]", "", file_paths)
    if file_paths in used_filenames:
      print(f"ERROR: {file_paths} used more than once!")
      continue

    with open("../html/sounds.json", "a+") as file:
      file.seek(0)
      try:
        sounds_json = json.load(file)
      except json.JSONDecodeError:
        sounds_json = []

    for entry in main_sounds_json:
      if entry["name"] == name:
         print(f"WARNING: In the sounds.json file, there exists an entry with the same id {file_paths}")

    is_ok = True

    for entry in sounds_json:
      if entry["name"] == name:
        print(f"ERROR: In the unvalidated.json file, there exists an entry with the same id {file_paths}. This entry has not been added.")
        is_ok = False

    if not is_ok:
      continue

    bg_id = bg.split("=")[1]
    sound_id = sound.split("=")[1]

    bg_file = gdrive.CreateFile({"id": bg_id})
    bg_file.GetContentFile(f"tmp/{file_paths}.image")

    sound_file = gdrive.CreateFile({"id": sound_id})
    sound_file.GetContentFile(f"tmp/{file_paths}.audio")

    image = Image.open(f"tmp/{file_paths}.image")
    image.thumbnail((256, 256), Image.ANTIALIAS)
    image.save(f"../html/media/{file_paths}.webp")

    image.close()

    audio = AudioSegment.from_file(f"tmp/{file_paths}.audio")
    audio.export(f"../html/sounds/{file_paths}.webm")

    sounds_json.append({
      "name": name,
      "id": file_paths,
      "category": category
    })

    with open("../html/sounds.json", "w") as file:
      json.dump(sounds_json, file)


if __name__ == "__main__":
  parse_excel_and_download()
