import os
from pydub import AudioSegment

path = input("File: ")
outpath = input("Output: ")

audio = AudioSegment.from_file(path)
audio.export(outpath)
