#include<stdio.h>
#include<string.h>
#include<assert.h>
#include<stdlib.h>
#include<errno.h>

#define MAX 100
#define MAX_NAME 20
#define MAX_SEX 10
#define MAX_TELE 12
#define MAX_ADDR 30
#define DEFAULT_SZ 3
#define INC_SZ 2

//联系人的信息
typedef struct PeoInFo
{
    char name[MAX_NAME];
    int age;
    char sex[MAX_SEX];
    char tele[MAX_TELE];
    char addr[MAX_ADDR];
}PeoInFo;

//通讯录
typedef struct Contact
{
    PeoInFo* data;//存放人的信息
    int count;//当前通讯录的人数
    int capacity;//当前通讯录容量
}Contact;

//初始化通讯录的信息
int InitContact(Contact* pc);

//增加联系人
void AddContact(Contact* pc);

//显示通讯录的信息
void ShowContact(const Contact* pc);

//删除联系人
void DelContact(Contact* pc);

//查找联系人
void SearchContact(Contact* pc);

//修改联系人信息
void ModifyContact(Contact* pc);

//按字母排序
void SortContact(Contact* pc);

//销毁通讯录
void DestroyContact(Contact* pc);