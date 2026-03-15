import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogpotstList } from './blogpotst-list';

describe('BlogpotstList', () => {
  let component: BlogpotstList;
  let fixture: ComponentFixture<BlogpotstList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogpotstList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogpotstList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
