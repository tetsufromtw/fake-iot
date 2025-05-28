import csv
import random
import sys

def generate_motor_data_csv(start_pos=0, interval=100):
    """
    モーターのデータCSVファイルを生成する

    Args:
        start_pos: 開始位置（デフォルト 0）
        interval: 間隔単位（デフォルト 100）
    """
    
    filename = "data.csv"
    data = []
    
    # 10000に到達するまでに必要なステップ数を計算
    steps_to_max = (10000 - start_pos) // interval
    
    motor1_pos = start_pos
    motor2_pos = start_pos
    
    for timestamp in range(steps_to_max + 1):
        # ランダムな温度を生成（250～310の間）
        temperature = random.randint(250, 310)
        
        # データを追加
        data.append({
            'timestamp': timestamp,
            'motor1_pos': motor1_pos,
            'motor2_pos': motor2_pos,
            'temperature': temperature
        })
        
        # 位置を更新
        motor1_pos = min(motor1_pos + interval, 10000)
        motor2_pos = min(motor2_pos + interval + random.randint(-20, 50), 10000)
    
    # CSVファイルに書き込む
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['timestamp', 'motor1_pos', 'motor2_pos', 'temperature']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        writer.writerows(data)
    
    print(f"✅ CSVファイルが生成されました: {filename}")
    print(f"📊 データ件数: {len(data)}")
    print(f"🔧 開始位置: {start_pos}")
    print(f"📏 間隔単位: {interval}")
    print(f"🎯 最大位置: {max(row['motor1_pos'] for row in data)}")

# 使用例
if __name__ == "__main__":
    # コマンドライン引数から読み込む
    if len(sys.argv) == 3:
        start_pos = int(sys.argv[1])
        interval = int(sys.argv[2])
    else:
        print("使い方: python script.py <開始位置> <間隔単位>")
        print("例: python script.py 0 100")
        sys.exit(1)
    
    generate_motor_data_csv(start_pos, interval)