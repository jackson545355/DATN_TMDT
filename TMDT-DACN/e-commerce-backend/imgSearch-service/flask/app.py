from flask import Flask, request, jsonify
from flask_cors import CORS
from keras.preprocessing import image
from keras.models import load_model
import requests
from io import BytesIO
import joblib
import numpy as np
# import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Cho phép tất cả các origin truy cập tất cả các route
# CORS(app)  # Cho phép các yêu cầu từ các origin khác

# Load model và encoder khi khởi động ứng dụng
model = load_model('e-commerce-model.keras')
encoder = joblib.load('label_encoder.pkl')

@app.route('/imgSearch', methods=['POST','GET'])
def imgSearch():
    # lấy từ formData
    # image_url = request.form.get('imageUrl')
    
    # lấy từ JSON
    data = request.get_json()
    image_url = data.get('imageUrl')
    print(image_url)
    if not image_url:
        return jsonify({'error': 'No image URL provided'}), 400
    
    # Xử lý URL hình ảnh tại đây
    print(f"Received image URL: {image_url}")
    # if file.filename == '':
    #     return jsonify({'error': 'No selected file'}), 400
    
    if image_url:
    #     filename = file.filename
    #     file_path = os.path.join(img_search_dir, filename)
    #     file.save(file_path)

    # #     # Giả sử chúng ta sẽ gọi Jupyter Notebook để xử lý hình ảnh
        similarity = predict_image(image_url)
        return jsonify({'similarity': similarity})
    return jsonify({'message': 'Image URL received successfully', 'imageUrl': image_url})

def predict_image(image_url):
    # Chuẩn bị ảnh
    response = requests.get(image_url)
    print(response)
    img = image.load_img(BytesIO(response.content), target_size=(128, 128))
    # img = image.load_img(img_path, target_size=(128, 128))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0

    # Dự đoán
    predictions = model.predict(img_array)

    # Lấy tất cả nhãn từ encoder
    all_labels = encoder.classes_

    # Hiển thị xác suất dự đoán cho mỗi nhãn
    result = {label: prob*100 for label, prob in zip(all_labels, predictions[0])}
    return result

# def run_notebook(image_path):
#     print("Starting notebook execution...")
#     # Đường dẫn tuyệt đối đến notebook
#     # current_dir = os.path.dirname(os.path.abspath(__file__))
#     notebook_path = './Untitled.ipynb'  # Đường dẫn tới notebook nằm cùng thư mục
#     print(notebook_path)
#     image_path = image_path.replace('\\',"\\\\")
#     print(image_path)
#     # Đọc notebook
#     with open(notebook_path, "r", encoding="utf-8") as f:
#         nb = nbformat.read(f, as_version=4)
    
#     # Chỉ giữ lại các cell có tag 'only'
#     cell_to_run = [cell for cell in nb.cells if 'only' in cell.metadata.get('tags', [])]
#     print(cell_to_run)
     
#     # Tạo một notebook mới chỉ chứa các cell có tag 'only'
#     new_nb = nbformat.v4.new_notebook()
#     new_nb.cells = cell_to_run
    
#     for cell in new_nb.cells:
#         if cell.cell_type == 'code' and './Data_check/anh_13.jpg' in cell.source:
#             cell.source = cell.source.replace('./Data_check/anh_13.jpg', f"{image_path}")
#     # print(image_path)
    
#     # Execute the notebook
#     ep = ExecutePreprocessor(timeout=600, kernel_name='python3')
    
#     # Đặt đường dẫn ảnh vào metadata để sử dụng trong notebook
#     # nb.metadata['image_path'] = image_path
    
#     # Thực thi notebook với metadata đã được cập nhật
#     ep.preprocess(new_nb, {'metadata': {'path': './'}})
    
    
    
#     # Trích xuất và trả về dữ liệu từ output của cell cuối cùng
#     # if cell_to_run.outputs:
#     #     output = cell_to_run.outputs[0]
#     #     if 'text' in output:
#     #         result_str = output['text']
#     #         result_dict = parse_output(result_str)
#     #         return result_dict
#     # output_data = nb['cells'][-1].outputs[0].data.get('text/plain', '')
#     # return output_data
#     return ep
# def parse_output(output_text):
#     # Parse the output text into a dictionary
#     result = {}
#     lines = output_text.strip().split('\n')
#     for line in lines:
#         if ':' in line:
#             label, prob = line.split(':')
#             label = label.strip()
#             prob = prob.strip().replace('%', '')
#             result[label] = float(prob)
#     return result

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3006, debug=True)

