import os
from flask import Flask
from flask_cors import CORS
import FinanceDataReader as fdr
import pandas as pd
import re
from collections import Counter
import pickle


def get_data():
    # data = pd.read_excel('data/naver_news_total_1_jybert.xlsx',index_col=0)
    # del data['title']
    # with open('data/naver_news_total_1_jybert.bin', 'wb') as f:
    #     pickle.dump(data, f)
    # total_data = pd.DataFrame()
    # for i in range(1,6):
    #     with open('data/naver_news_total_1_jybert.bin', 'rb') as f:
    #         data = pickle.load(f)
    #         total_data = pd.concat([total_data, data])
    with open('data/total_data.bin', 'rb') as f:
        total_data = pickle.load(f)
    return total_data
app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app)

@app.route('/', methods = ['GET','POST'])
def test():
    return "hello"
@app.route('/date/<date>', methods = ['GET','POST'])
def data_by_date(date):
    ## date 넣으면 word, freq
    data = get_data()
    data["date"] = data["date"].apply(lambda x: str(x))
    data = data[data.date == date]
    sentence = re.sub('[^a-zA-Z가-힣0-9. ]', ' ', ' '.join(list(map(lambda x: str(x), data.title_new))))
    words = sentence.split(' ')
    words = list(filter(lambda x: len(x)>1, words))
    top_freq = Counter(words).most_common(100)
    return {"top_freq": top_freq}

@app.route('/keyword/', methods = ['GET','POST'], defaults={'keyword': ""})
@app.route('/keyword/<keyword>', methods = ['GET','POST'])
def data_by_keyword(keyword):
    ## keyword 넣으면 날짜별 스코어 1/2와 워드 클라우드
    data = get_data()
    total_len = len(data)
    if keyword != "":
        data['tf'] = data['title_new'].apply(lambda x: keyword in str(x))
        data = data[data.tf == True]
        del data['tf']
    print(len(data))
    data_neg = data.sort_values('jybert_score').drop_duplicates(subset=['date','title_new']).iloc[:10]
    data_neg = {'date':data_neg.date.tolist(),
                'title': data_neg.title_new.tolist(),
                'score': list(map(lambda x: int(x*100)/100,data_neg.jybert_score.tolist()))
                }
    data_pos = data.sort_values('jybert_score', ascending=False).drop_duplicates(subset=['date','title_new']).iloc[:10]
    data_pos = {'date': data_pos.date.tolist(),
                'title': data_pos.title_new.tolist(),
                'score': list(map(lambda x: int(x*100)/100,data_pos.jybert_score.tolist()))
                }
    sentence = re.sub('[^a-zA-Z가-힣0-9. ]', ' ', ' '.join(list(map(lambda x: str(x), data.title_new))))
    words = sentence.split(' ')
    words = list(filter(lambda x: len(x)>1, words))
    top_freq = Counter(words).most_common(50)
    data['count'] = 1
    total_count = data[['date','count']].groupby('date').sum().sort_index()
    count_idx = '/'.join([str((total_count.idxmax()).values[0])[:4], str((total_count.idxmax()).values[0])[4:6], str((total_count.idxmax()).values[0])[6:]])
    total_sum = data[['date','jybert_score']].groupby('date').sum().sort_index()
    total_avg = data[['date','jybert_score']].groupby('date').mean().sort_index()
    min_idx, min_val = '/'.join([str((total_sum.idxmin()).values[0])[:4], str((total_sum.idxmin()).values[0])[4:6], str((total_sum.idxmin()).values[0])[6:]]), total_sum.loc[int(total_sum.idxmin())].values[0]
    max_idx, max_val = '/'.join([str((total_sum.idxmax()).values[0])[:4], str((total_sum.idxmax()).values[0])[4:6], str((total_sum.idxmax()).values[0])[6:]]), total_sum.loc[int(total_sum.idxmax())].values[0]
    total_sum = {'date' : total_sum.index.tolist(), 'score' : total_sum['jybert_score'].tolist()}
    total_avg = {'date' : total_avg.index.tolist(), 'score' : total_avg['jybert_score'].tolist()}

    return {'top_freq':top_freq, 'total_sum':total_sum, 'total_avg':total_avg, 'total_len':len(data),
            'percent':int(len(data)/total_len*10000)/100, 'count_idx':count_idx, 'count': max(total_count['count'].tolist()),
            'min_idx':min_idx, 'min_val':str(int(min_val*100)/100), 'max_val':str(int(max_val*100)/100), 'max_idx':max_idx,
            'data_pos':data_pos, 'data_neg':data_neg}



if __name__ == '__main__':
    # data = get_data()
    # data_by_keyword('코스피')
    # top_freq_dat = data_by_date(data, 20181001)
    # top_freq_key = data_by_keyword(data, "코스피")
    app.run(debug=True, host='0.0.0.0', port=5001)
    print(1)