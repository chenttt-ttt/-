#include"contact.h.c"

int InitContact(Contact* pc)
{
    assert(pc);
    pc -> count = 0;
    pc ->data = (PeoInFo*)calloc(DEFAULT_SZ, sizeof(PeoInFo));
    if(pc -> data == NULL)
    {
        printf("InitContact::%s\n",strerror(errno));
        return 1;
    }
    pc -> capacity = DEFAULT_SZ;
    return 0;
}

void DestroyContact(Contact* pc)
{
    assert(pc);
    free(pc -> data);
    pc -> data = NULL;
}

void CheckCapacity(Contact *pc)
{
    if(pc -> count == pc -> capacity)
    {
        PeoInFo *ptr = (PeoInFo*) realloc(pc -> data,(pc -> capacity + INC_SZ)*sizeof(PeoInFo));
        if(ptr == NULL)
        {
            printf("AddContact::%s\n",strerror(errno));
            return;
        }
        else
        {
            pc -> data = ptr;
            pc -> capacity += INC_SZ;
            printf("Capacity expansion successful\n");
        }
    }
}

void AddContact(Contact* pc)
{
    assert(pc);
    CheckCapacity(pc);
    printf("please print name\n");
    scanf("%s",pc -> data[pc -> count].name);
    printf("please print age\n");
    scanf("%d",&(pc -> data[pc -> count].age));
    printf("please print sex\n");
    scanf("%s",pc -> data[pc -> count].sex);
    printf("please print telephone\n");
    scanf("%s",pc -> data[pc -> count].tele);
    printf("please print address\n");
    scanf("%s",pc -> data[pc -> count].addr);
    pc -> count++;
    printf("added successfully\n");
}

void ShowContact(const Contact* pc)
{
    assert(pc);
    printf("%-20s\t%-5s\t%-5s\t%-12s\t%-30s\n","name","age","sex","telephone","address");
    for(int i = 0; i < pc -> count; i++)
    {
        printf("%-20s\t%-5d\t%-5s\t%-12s\t%-30s\n",pc -> data[i].name,
               pc -> data[i].age,
               pc -> data[i].sex,
               pc -> data[i].tele,
               pc -> data[i].addr);
    }
}

int FindByName(Contact* pc,char name[])
{
    assert(pc);
    for(int i = 0; i < pc -> count; i++)
    {
        if(strcmp(pc -> data[i].name,name) == 0)
        {
            return i;
        }
    }
    return -1;
}

void DelContact(Contact* pc)
{
    assert(pc);
    char name[MAX_NAME] = {0};
    if(pc -> count == 0)
    {
        printf("The address book is empty, please select again\n");
        return;
    }
    printf("Please enter the name of the contact you want to delete\n");
    scanf("%s", name);
    int pos = FindByName(pc,name);
    if(pos == -1)
    {
        printf("This contact does not exist\n");
        return;
    }
    for(int i = pos; i < pc -> count - 1; i++)
    {
        pc -> data[i] = pc -> data[i + 1];
    }
    pc -> count--;
    printf("deleted successfully\n");
}

void SearchContact(Contact* pc)
{
    assert(pc);
    char name[MAX_NAME] = {0};
    printf("Please enter the name of the contact you want to search\n");
    scanf("%s", name);
    int pos = FindByName(pc,name);
    if(pos == -1)
    {
        printf("This contact does not exist\n");
        return;
    }
    printf("%-20s\t%-5s\t%-5s\t%-12s\t%-30s\n","name","age","sex","telephone","address");
    printf("%-20s\t%-5d\t%-5s\t%-12s\t%-30s\n",pc -> data[pos].name,
           pc -> data[pos].age,
           pc -> data[pos].sex,
           pc -> data[pos].tele,
           pc -> data[pos].addr);
}

void ModifyContact(Contact* pc)
{
    assert(pc);
    char name[MAX_NAME] = {0};
    printf("Please enter the name of the contact you want to modify\n");
    scanf("%s", name);
    int pos = FindByName(pc,name);
    if(pos == -1)
    {
        printf("This contact does not exist\n");
        return;
    }
    printf("Found, starting to modify\n");
    printf("please print name\n");
    scanf("%s",pc -> data[pos].name);
    printf("please print age\n");
    scanf("%d",&(pc -> data[pos].age));
    printf("please print sex\n");
    scanf("%s",pc -> data[pos].sex);
    printf("please print telephone\n");
    scanf("%s",pc -> data[pos].tele);
    printf("please print address\n");
    scanf("%s",pc -> data[pos].addr);
    printf("Modified successfully\n");
}

int com_peo_by_name(const void* e1, const void* e2)
{
    return strcmp(((PeoInFo*)e1) -> name,((PeoInFo*)e2) -> name);
}

void SortContact(Contact* pc)
{
    assert(pc);
    qsort(pc -> data, pc -> count, sizeof(PeoInFo), com_peo_by_name);
    printf("Sorted successfully\n") ;
}
