import os
from pydub import AudioSegment

path = input("Folder: ")
outpath = input("Output folder: ")
extension = input("Extension: ")

for file in os.listdir(path):
  file_path = f"{path}/{file}"

  file = file.split(".")[0]

  audio = AudioSegment.from_file(file_path)
  audio.export(f"{outpath}/{file}.{extension}")
