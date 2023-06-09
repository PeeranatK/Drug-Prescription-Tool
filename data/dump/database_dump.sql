PGDMP     &    ,                {            Project    14.6    15.0     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16402    Project    DATABASE     u   CREATE DATABASE "Project" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';
    DROP DATABASE "Project";
                postgres    false                        2615    2200    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                postgres    false            �           0    0    SCHEMA public    ACL     Q   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;
                   postgres    false    5            �            1259    16428    d_interaction    TABLE     �   CREATE TABLE public.d_interaction (
    ddi_id integer NOT NULL,
    drug1 character varying(100) NOT NULL,
    drug2 character varying(100) NOT NULL,
    description character varying(200) NOT NULL,
    level character varying(10) NOT NULL
);
 !   DROP TABLE public.d_interaction;
       public         heap    postgres    false    5            �            1259    16445    diseaselist    TABLE     j   CREATE TABLE public.diseaselist (
    di_id integer NOT NULL,
    name character varying(100) NOT NULL
);
    DROP TABLE public.diseaselist;
       public         heap    postgres    false    5            �            1259    16450    druglist    TABLE     f   CREATE TABLE public.druglist (
    d_id integer NOT NULL,
    name character varying(100) NOT NULL
);
    DROP TABLE public.druglist;
       public         heap    postgres    false    5            �            1259    16438    rule_conditions    TABLE     �   CREATE TABLE public.rule_conditions (
    cid integer NOT NULL,
    rule_id integer NOT NULL,
    fact character varying(100) NOT NULL,
    operator character varying(100) NOT NULL,
    value text NOT NULL
);
 #   DROP TABLE public.rule_conditions;
       public         heap    postgres    false    5            �            1259    16433    rules    TABLE     �   CREATE TABLE public.rules (
    rid integer NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(200) NOT NULL,
    method character varying(10) NOT NULL,
    priority integer NOT NULL
);
    DROP TABLE public.rules;
       public         heap    postgres    false    5            �          0    16428    d_interaction 
   TABLE DATA           Q   COPY public.d_interaction (ddi_id, drug1, drug2, description, level) FROM stdin;
    public          postgres    false    209          �          0    16445    diseaselist 
   TABLE DATA           2   COPY public.diseaselist (di_id, name) FROM stdin;
    public          postgres    false    212   �       �          0    16450    druglist 
   TABLE DATA           .   COPY public.druglist (d_id, name) FROM stdin;
    public          postgres    false    213   �       �          0    16438    rule_conditions 
   TABLE DATA           N   COPY public.rule_conditions (cid, rule_id, fact, operator, value) FROM stdin;
    public          postgres    false    211   L       �          0    16433    rules 
   TABLE DATA           I   COPY public.rules (rid, name, description, method, priority) FROM stdin;
    public          postgres    false    210   u       /           2606    16432     d_interaction d_interaction_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.d_interaction
    ADD CONSTRAINT d_interaction_pkey PRIMARY KEY (ddi_id);
 J   ALTER TABLE ONLY public.d_interaction DROP CONSTRAINT d_interaction_pkey;
       public            postgres    false    209            5           2606    16449    diseaselist diseaselist_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.diseaselist
    ADD CONSTRAINT diseaselist_pkey PRIMARY KEY (di_id);
 F   ALTER TABLE ONLY public.diseaselist DROP CONSTRAINT diseaselist_pkey;
       public            postgres    false    212            7           2606    16454    druglist druglist_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.druglist
    ADD CONSTRAINT druglist_pkey PRIMARY KEY (d_id);
 @   ALTER TABLE ONLY public.druglist DROP CONSTRAINT druglist_pkey;
       public            postgres    false    213            3           2606    16444 $   rule_conditions rule_conditions_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.rule_conditions
    ADD CONSTRAINT rule_conditions_pkey PRIMARY KEY (cid);
 N   ALTER TABLE ONLY public.rule_conditions DROP CONSTRAINT rule_conditions_pkey;
       public            postgres    false    211            1           2606    16437    rules rules_pkey 
   CONSTRAINT     O   ALTER TABLE ONLY public.rules
    ADD CONSTRAINT rules_pkey PRIMARY KEY (rid);
 :   ALTER TABLE ONLY public.rules DROP CONSTRAINT rules_pkey;
       public            postgres    false    210            �   �   x���Mj1���S���� ͢�6��F����<�����
q��B�'$����Y����bi@d��i�<$�'P	 |VQ4E�\@i��t	*�$��)c���Fb
��iB�G2�a����up���¢�&]����/<jL��ت�!A|%����Bh���K�@=�RA,�fK���\���
�RY�O�C��s�w��Me�A�c����<n�sߡ:��      �   �  x�m��r�0��ާЭp��� ��Lӆ�	if:Ӌ,/XE�<���9�5�z}��݂ݤ7ke�����sQyd��!3��QI/�o�C���*s~��r� ��K��@�α�tȩ���k��!$����6`,x�NG�I�P�Q��:p�ipõ@˸��WSY��4�������-,��0�*7hORp�U�h���]e�3S���y3��e���0�J��¤��+�e�����q��9q�J�&]mK��^
�]y���!�)z�kkdaO��dr�˨�fS���h�,3d[#��R "��� "�y�	M㈤�RQ��"����R�M꼭�'�l[��hn�s6��l�4������{m��<�Rf��W+�?�F��RR֞�f��n�c��wO��!�W6�~���qH���B��H���AL�9���qL	�BdO� u;2>'q/���Y��&��a�g^��5/
s���x���^���tY�P�g�E�zX�cu�BrHzd�W�a�CrC@�!�ߴ��(5$=���Jq��5T�L[�x���]J�&S4����y���j�����J��lc���Oܵ.�%������\��H�8�PwK��P!��:���I�2�"!Tt~��B*� ,V�e�*�O�hҮ=9PղG���K��~1�b��}�(�o��7,��      �   �  x�-S�r�0=w_@����d�Iť-+�dd�e��yr�����ѹ�tk9�sob0C\�q�p�;3$R���(c�������a�1J����f�%�~U�G��n�N��|��`���]MNf1��x��0\R�,�k=\��1����������Y	A� =g]#f'��	7=$eC׫��E2�=�����8э_V���t3f�.r�ѭ�A��s�'����w�"�����V��I��p^�{ie���5�7V���M�	@G�[���������f:d>��Qˮ�;��?�};�ֵ�"����l�p�ӽ��q�}9`	:#N����z�Y���x.z0�qF_�����N`��Yy��5�leF�����*�D�%`�e�}蓦L�"�O��N<F��ݗu��ꭷ\6�\v�c��ng'0Xa	\��U}�BԊ��{��o�j�
zt�ĈΪ��ެpU�������'q)������S���1���}Y[m�i��@�V��^Z�3�:��+��Ꜿ��Ч�Hx�{�uIߍ�`�uE?�W�k k�	�oi�'v�p}�_S;z;s}���8RlY7�D{�[o�Ģ�ic̤�_�BT��`��X���<;n�(�Mঢ[|�QX[˿�2�?:F�      �     x�u��n�0D����
���c�ʭ�S/��ơ�CU�{�
Z"���grҴh<{3�{v�BUpl'��kP
��� ���	R�e����2�;k��G>'�v�"��DF~�֡;p4��pяj.w�9ĸjٓ.U%ڛ�xr>U5�.r��"Ko\�'�B,׿��������	��T��[��AiM9���!����zF�(RƒcٞS۹��Fʮ�����\��>�����v������rTN��Su�B��[Hմ����R��,��      �   �   x���9�@��z|
_ (	K��	���d�`)�(�ۓ��� ���;2K��z㝙���X,��5$wA�I6��xe��ΞU�(��-�f)p�IDq��W�;\�wCei�5_���Hz�i��H7�b�:�ݎ��;ݜM`�3H[����~����w�0��fe�.ϵC<�g'�~�&�}��v  	��9     