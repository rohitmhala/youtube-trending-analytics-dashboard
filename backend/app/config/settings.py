from dotenv import load_dotenv
import os

load_dotenv()

AWS_REGION = os.getenv("AWS_REGION")
ATHENA_DATABASE = os.getenv("ATHENA_DATABASE")
ATHENA_OUTPUT_LOCATION = os.getenv("ATHENA_OUTPUT_LOCATION")
ATHENA_WORKGROUP = os.getenv("ATHENA_WORKGROUP")