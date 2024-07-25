//����ȫ��ajax
$(document).bind("mobileinit", function() {
    //disable ajax nav
    $.mobile.ajaxEnabled=false
});
//��ʾ������
function showLoader(t,c) {/*t:����  c:����*/
    //��ʾ������.for jQuery Mobile 1.2.0
    $.mobile.loading('show', {
        text: "", //����������ʾ������
        textVisible: true, //�Ƿ���ʾ����
        theme: 'b',        //������������ʽa-e
        textonly: true,   //�Ƿ�ֻ��ʾ����
        html: "<h1>"+t+"</h1><h1>"+c+"</h1>"   //Ҫ��ʾ��html���ݣ���ͼƬ��
    });
}
//���ؼ�����.for jQuery Mobile 1.2.0
function hideLoader()
{
    $.mobile.loading('hide');
}