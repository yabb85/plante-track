from flask_uploads import UploadSet
from flask_uploads import IMAGES

uploaded_image = UploadSet('photos', IMAGES)
