print("Calcultor App..")

a= int(input('''Which Operation You Want To perform: \n 1. Addition \n 2. Substarction \n 3. Multiplication \n 4. Division \n'''))

match a:
    case 1: 
        a = int(input("Eneter first Number : "))
        b = int(input("Enter Second Number : "))
        c = a + b
        print(f" The aAddition of {a} and {b} is {c} ")
    case 2:
        a = int(input("Eneter first Number : "))
        b = int(input("Enter Second Number : "))
        c = a - b
        print(f" The Substraction of {a} and {b} is {c} ")
    case 3:
        a = int(input("Eneter first Number : "))
        b = int(input("Enter Second Number : "))
        c = a * b
        print(f" The multiplication  of {a} and {b} is {c} ")
    case 4:
        a = int(input("Eneter first Number : "))
        b = int(input("Enter Second Number : "))
        c = a / b
        print(f" The Division of {a} and {b} is {c} ")
    case _:
        print("Please enter valied choice...")    